import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openai";

const maxAudioSizeBytes = 25 * 1024 * 1024;
const supportedAudioMimeTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/mpga",
  "audio/x-m4a",
  "audio/m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/aac",
  "audio/webm",
  "audio/ogg"
]);
const supportedAudioExtensions = new Set([
  "webm",
  "mp4",
  "m4a",
  "mp3",
  "mpeg",
  "mpga",
  "wav",
  "aac",
  "ogg"
]);

function getFileExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  return extension && extension !== fileName.toLowerCase() ? extension : "";
}

function getNormalizedMimeType(mimeType: string) {
  return mimeType.toLowerCase().split(";")[0]?.trim() ?? "";
}

function isSupportedAudioFile(file: File) {
  const normalizedMimeType = getNormalizedMimeType(file.type);
  const extension = getFileExtension(file.name);

  if (supportedAudioMimeTypes.has(normalizedMimeType)) {
    return true;
  }

  return normalizedMimeType === "application/octet-stream"
    ? supportedAudioExtensions.has(extension)
    : false;
}

function getOpenAIFileName(file: File) {
  const extension = getFileExtension(file.name);

  if (supportedAudioExtensions.has(extension)) {
    return file.name;
  }

  const normalizedMimeType = getNormalizedMimeType(file.type);

  if (normalizedMimeType === "audio/mp4") {
    return "recording.mp4";
  }

  if (normalizedMimeType === "audio/x-m4a" || normalizedMimeType === "audio/m4a") {
    return "recording.m4a";
  }

  if (normalizedMimeType === "audio/mpeg" || normalizedMimeType === "audio/mp3") {
    return "recording.mp3";
  }

  if (normalizedMimeType === "audio/wav" || normalizedMimeType === "audio/x-wav") {
    return "recording.wav";
  }

  if (normalizedMimeType === "audio/aac") {
    return "recording.aac";
  }

  if (normalizedMimeType === "audio/ogg") {
    return "recording.ogg";
  }

  return "recording.webm";
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY fehlt auf dem Server." },
      { status: 500 }
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage. Erwartet wird FormData mit einer Audiodatei." },
      { status: 400 }
    );
  }

  const audio = formData.get("audio");

  if (!(audio instanceof File)) {
    return NextResponse.json(
      { error: "Keine Datei erhalten." },
      { status: 400 }
    );
  }

  if (audio.size === 0) {
    return NextResponse.json(
      { error: "Die Audiodatei ist leer." },
      { status: 400 }
    );
  }

  if (audio.size > maxAudioSizeBytes) {
    return NextResponse.json(
      { error: "Die Audiodatei ist zu groß. Maximal erlaubt sind 25 MB." },
      { status: 413 }
    );
  }

  if (!isSupportedAudioFile(audio)) {
    return NextResponse.json(
      { error: "Dateityp nicht unterstützt." },
      { status: 400 }
    );
  }

  try {
    const openai = createOpenAIClient();
    const fileName = getOpenAIFileName(audio);
    const openAIFile =
      fileName === audio.name
        ? audio
        : new File([await audio.arrayBuffer()], fileName, {
            type: audio.type || "application/octet-stream"
          });
    const transcription = await openai.audio.transcriptions.create({
      file: openAIFile,
      model: "gpt-4o-mini-transcribe"
    });

    return NextResponse.json({
      transcript: transcription.text
    });
  } catch {
    return NextResponse.json(
      { error: "OpenAI-Transkription fehlgeschlagen." },
      { status: 502 }
    );
  }
}
