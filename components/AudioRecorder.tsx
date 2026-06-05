"use client";

import { Mic, Play, RotateCcw, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RecordingState, TranscriptionState } from "@/lib/types";

const supportedMimeTypes = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/mpeg"
];

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  return supportedMimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

export function AudioRecorder() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [transcriptionState, setTranscriptionState] =
    useState<TranscriptionState>("idle");
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function revokeAudioUrl() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }

  async function startRecording() {
    setErrorMessage("");

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setRecordingState("error");
      setErrorMessage("Audioaufnahme wird in diesem Browser nicht unterstützt.");
      return;
    }

    setRecordingState("requesting_permission");
    revokeAudioUrl();
    setAudioBlob(null);
    setTranscript("");
    setTranscriptionState("idle");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm"
        });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecordingState("stopped");
        clearTimer();
        stopStream();
      };

      mediaRecorder.onerror = () => {
        setRecordingState("error");
        setErrorMessage("Die Aufnahme konnte nicht abgeschlossen werden.");
        clearTimer();
        stopStream();
      };

      mediaRecorder.start();
      setElapsedSeconds(0);
      setRecordingState("recording");
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((seconds) => seconds + 1);
      }, 1000);
    } catch (error) {
      setRecordingState("error");
      clearTimer();
      stopStream();

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setErrorMessage("Mikrofonzugriff wurde abgelehnt.");
        return;
      }

      setErrorMessage("Mikrofonzugriff konnte nicht gestartet werden.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  async function transcribeRecording() {
    setErrorMessage("");
    setTranscript("");

    if (!audioBlob) {
      setTranscriptionState("error");
      setErrorMessage("Keine Aufnahme vorhanden.");
      return;
    }

    setTranscriptionState("processing");

    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes("mp4") ? "mp4" : "webm";
      const audioFile = new File([audioBlob], `capture.${extension}`, {
        type: audioBlob.type || "audio/webm"
      });

      formData.append("audio", audioFile);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as {
        transcript?: string;
        error?: string;
      };

      if (!response.ok || !result.transcript) {
        throw new Error(result.error || "Transkription fehlgeschlagen.");
      }

      setTranscript(result.transcript);
      setTranscriptionState("success");
    } catch (error) {
      setTranscriptionState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Transkription fehlgeschlagen."
      );
    }
  }

  function discardRecording() {
    clearTimer();
    stopStream();
    revokeAudioUrl();
    setAudioBlob(null);
    chunksRef.current = [];
    mediaRecorderRef.current = null;
    setElapsedSeconds(0);
    setErrorMessage("");
    setTranscript("");
    setTranscriptionState("idle");
    setRecordingState("idle");
  }

  useEffect(() => {
    return () => {
      clearTimer();
      stopStream();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const isRequestingPermission = recordingState === "requesting_permission";
  const isRecording = recordingState === "recording";
  const isStopped = recordingState === "stopped";
  const isTranscribing = transcriptionState === "processing";

  return (
    <div className="flex w-full flex-col items-center text-center">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isRequestingPermission || isStopped}
        aria-pressed={isRecording}
        className={`flex aspect-square w-56 max-w-[72vw] flex-col items-center justify-center rounded-full border shadow-soft transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed ${
          isRecording
            ? "border-red-200 bg-red-600 text-white"
            : "border-black/10 bg-ink text-paper disabled:opacity-70"
        }`}
      >
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/12">
          {isRecording ? (
            <Square aria-hidden="true" className="h-8 w-8 fill-current" strokeWidth={2} />
          ) : (
            <Mic aria-hidden="true" className="h-9 w-9" strokeWidth={1.9} />
          )}
        </span>
        <span className="text-2xl font-semibold">
          {isRecording ? "Aufnahme läuft" : "Sprich los"}
        </span>
        <span className="mt-2 text-sm text-white/72">
          {isRequestingPermission
            ? "Mikrofon wird angefragt"
            : isRecording
              ? formatDuration(elapsedSeconds)
              : "Tippen zum Aufnehmen"}
        </span>
      </button>

      {isRecording && (
        <button
          type="button"
          onClick={stopRecording}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-red-600 px-5 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
        >
          <Square aria-hidden="true" className="h-4 w-4 fill-current" />
          Aufnahme stoppen
        </button>
      )}

      <div className="mt-6 min-h-6 text-sm font-medium text-sage">
        {isStopped && "Aufnahme bereit"}
      </div>

      {isStopped && audioUrl && (
        <section className="mt-4 w-full rounded-lg border border-black/10 bg-paper p-4 text-left">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <Play aria-hidden="true" className="h-4 w-4" />
            Anhören
          </div>
          <audio controls src={audioUrl} className="w-full" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={discardRecording}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-neutral-700"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Verwerfen
            </button>
            <button
              type="button"
              disabled={isTranscribing}
              onClick={transcribeRecording}
              className="h-11 rounded-md bg-ink px-3 text-sm font-semibold text-paper transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isTranscribing ? "Transkription läuft ..." : "Verarbeiten"}
            </button>
          </div>
          {isTranscribing && (
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Transkription läuft ...
            </p>
          )}
          {transcript && (
            <div className="mt-4 rounded-md bg-white p-3">
              <h3 className="text-sm font-semibold text-ink">Transkript</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                {transcript}
              </p>
            </div>
          )}
        </section>
      )}

      {(recordingState === "error" || transcriptionState === "error") &&
        errorMessage && (
        <p className="mt-5 max-w-xs text-sm leading-6 text-red-700">{errorMessage}</p>
      )}

      <p className="mt-7 max-w-xs text-sm leading-6 text-neutral-600">
        Im MVP bleibt die Aufnahme zunächst lokal im Browser, bis du sie verarbeitest.
      </p>
    </div>
  );
}
