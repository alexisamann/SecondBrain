import { createClient } from "@/lib/supabase/server";

export type DashboardSmokeStatus = {
  email: string;
  profileFound: boolean;
  thoughtsCount: number;
  openLoopsCount: number;
  errors: string[];
};

export async function getDashboardSmokeStatus(): Promise<DashboardSmokeStatus> {
  const supabase = await createClient();
  const errors: string[] = [];

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      email: "Nicht angemeldet",
      profileFound: false,
      thoughtsCount: 0,
      openLoopsCount: 0,
      errors: ["Kein eingeloggter Nutzer gefunden."]
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    errors.push(`Profil konnte nicht geladen werden: ${profileError.message}`);
  } else if (!profile) {
    errors.push("Kein Profil gefunden. Prüfe den auth.users Trigger und die RLS-Policies.");
  }

  const { count: thoughtsCount, error: thoughtsError } = await supabase
    .from("thoughts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (thoughtsError) {
    errors.push(`Gedanken konnten nicht gezählt werden: ${thoughtsError.message}`);
  }

  const { count: openLoopsCount, error: openLoopsError } = await supabase
    .from("extracted_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "open");

  if (openLoopsError) {
    errors.push(`Offene Loops konnten nicht gezählt werden: ${openLoopsError.message}`);
  }

  return {
    email: profile?.email ?? user.email ?? "Unbekannt",
    profileFound: Boolean(profile),
    thoughtsCount: thoughtsCount ?? 0,
    openLoopsCount: openLoopsCount ?? 0,
    errors
  };
}
