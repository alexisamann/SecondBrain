"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FormStatus = "idle" | "loading" | "success" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const supabase = createClient();
      const emailRedirectTo = `${window.location.origin}/auth/confirm`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo
        }
      });

      if (error) {
        setStatus("error");
        setMessage(`Fehler beim Senden: ${error.message}`);
        return;
      }

      setStatus("success");
      setMessage("Prüfe deine E-Mails für den Login-Link.");
    } catch {
      setStatus("error");
      setMessage("Login konnte nicht gestartet werden. Prüfe die Supabase-Konfiguration.");
    }
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-ink">
          E-Mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="du@example.com"
          required
          autoComplete="email"
          className="mt-2 h-12 w-full rounded-md border border-black/10 bg-white px-3 text-base text-ink outline-none transition focus:border-ink"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-md bg-ink px-4 text-sm font-semibold text-paper transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Wird gesendet ..." : "Magic Link senden"}
      </button>

      {message && (
        <p
          className={
            status === "error"
              ? "text-sm leading-6 text-red-700"
              : "text-sm leading-6 text-sage"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
