import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openai";

const maxAudioSizeBytes = 25 * 1024 * 1024;
const supportedAudioTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/mpga",
  "audio/m4a",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "video/mp4",
  "application/octet-stream"
]);

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
      { error: "Keine Aufnahme vorhanden." },
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

  if (audio.type && !supportedAudioTypes.has(audio.type)) {
    return NextResponse.json(
      { error: "Ungültige Datei. Bitte sende eine unterstützte Audiodatei." },
      { status: 400 }
    );
  }

  try {
    const openai = createOpenAIClient();
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "gpt-4o-mini-transcribe"
    });

    return NextResponse.json({
      transcript: transcription.text
    });
  } catch {
    return NextResponse.json(
      { error: "Transkription fehlgeschlagen." },
      { status: 502 }
    );
  }
}
