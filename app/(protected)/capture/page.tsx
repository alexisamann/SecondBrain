import { AppShell } from "@/components/AppShell";
import { AudioRecorder } from "@/components/AudioRecorder";

export default function CapturePage() {
  return (
    <AppShell>
      <section className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
        <p className="mb-5 text-sm font-medium text-sage">
          Sprich einfach los. Deine KI ordnet alles für dich.
        </p>
        <AudioRecorder />
        <p className="mt-8 max-w-xs text-sm leading-6 text-neutral-600">
          Du kannst einfach sprechen. Wenn du willst, sag am Anfang: Zum Thema ...
        </p>
      </section>
    </AppShell>
  );
}
