import { AppShell } from "@/components/AppShell";
import { PlaceholderCard } from "@/components/PlaceholderCard";
import { getDashboardSmokeStatus } from "@/lib/data/dashboard";

export default async function TodayPage() {
  const systemStatus = await getDashboardSmokeStatus();

  return (
    <AppShell title="Heute wichtig">
      <div className="space-y-3">
        <section className="rounded-lg border border-black/10 bg-paper p-4">
          <h2 className="text-base font-semibold text-ink">Systemstatus</h2>
          <dl className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
            <div className="flex items-center justify-between gap-4">
              <dt>Angemeldet als</dt>
              <dd className="truncate text-right font-medium text-ink">
                {systemStatus.email}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Profil gefunden</dt>
              <dd className="font-medium text-ink">
                {systemStatus.profileFound ? "Ja" : "Nein"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Gespeicherte Gedanken</dt>
              <dd className="font-medium text-ink">{systemStatus.thoughtsCount}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Offene Loops</dt>
              <dd className="font-medium text-ink">{systemStatus.openLoopsCount}</dd>
            </div>
          </dl>
          {systemStatus.errors.length > 0 && (
            <div className="mt-3 space-y-1 rounded-md bg-red-50 p-3 text-sm leading-6 text-red-700">
              {systemStatus.errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </section>
        <PlaceholderCard
          title="Letzte Gedanken"
          description="Deine zuletzt eingesprochenen Gedanken werden hier zusammengefasst."
        />
        <PlaceholderCard
          title="Offene Aufgaben"
          description="Automatisch erkannte Aufgaben aus deinen Gedanken erscheinen hier."
          tone="sage"
        />
        <PlaceholderCard
          title="Offene Entscheidungen"
          description="Punkte, bei denen noch eine Entscheidung aussteht, werden hier gesammelt."
        />
        <PlaceholderCard
          title="Wiederkehrende Themen"
          description="Themen, die öfter auftauchen, werden später hier sichtbar."
          tone="warm"
        />
      </div>
    </AppShell>
  );
}
