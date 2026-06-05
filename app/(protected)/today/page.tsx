import { AppShell } from "@/components/AppShell";
import { PlaceholderCard } from "@/components/PlaceholderCard";

export default function TodayPage() {
  return (
    <AppShell title="Heute wichtig">
      <div className="space-y-3">
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
