import { SendHorizonal } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export default function ChatPage() {
  return (
    <AppShell title="Frag dein Gedächtnis">
      <section className="flex flex-1 flex-col rounded-lg border border-black/10 bg-paper">
        <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
          <p className="max-w-xs text-sm leading-6 text-neutral-600">
            Sobald Gedanken gespeichert sind, kannst du hier Fragen an dein Gedächtnis stellen.
          </p>
        </div>
        <form className="border-t border-black/10 p-3">
          <label htmlFor="memory-question" className="sr-only">
            Frage an dein Gedächtnis
          </label>
          <div className="flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2">
            <input
              id="memory-question"
              type="text"
              placeholder="Was beschäftigt mich gerade?"
              disabled
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled
              aria-label="Frage senden"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-paper opacity-45"
            >
              <SendHorizonal aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
