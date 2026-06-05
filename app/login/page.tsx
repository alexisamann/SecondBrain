import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/capture");
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-mist px-5 py-8">
      <section className="w-full max-w-sm rounded-lg border border-black/10 bg-paper p-6 shadow-soft">
        <p className="text-sm font-medium text-sage">Second Brain</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink">
          Willkommen zurück
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Gib deine E-Mail ein. Wir senden dir einen Magic Link zum Einloggen.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
