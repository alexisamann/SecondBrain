import { AppShell } from "@/components/AppShell";
import { PlaceholderCard } from "@/components/PlaceholderCard";

export default function MemoryPage() {
  return (
    <AppShell title="Dein Gedächtnis">
      <PlaceholderCard
        title="Gedankenliste"
        description="Hier entsteht später eine ruhige, durchsuchbare Übersicht deiner gespeicherten Gedanken."
      />
    </AppShell>
  );
}
