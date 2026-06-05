import { AppShell } from "@/components/AppShell";
import { PlaceholderCard } from "@/components/PlaceholderCard";

export default function LoopsPage() {
  return (
    <AppShell title="Offene Loops">
      <div className="space-y-3">
        <PlaceholderCard
          title="Aufgaben"
          description="Noch offene Aufgaben werden aus deinen Aufnahmen erkannt."
          tone="sage"
        />
        <PlaceholderCard
          title="Entscheidungen"
          description="Ungeklärte Entscheidungen bekommen hier einen festen Platz."
        />
        <PlaceholderCard
          title="Fragen"
          description="Fragen, die du dir selbst stellst, werden später gesammelt."
          tone="warm"
        />
        <PlaceholderCard
          title="Ideen"
          description="Lose Ideen bleiben sichtbar, ohne dass du sie manuell sortieren musst."
        />
      </div>
    </AppShell>
  );
}
