"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-black/10 bg-paper px-3 text-sm font-medium text-neutral-600 transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut aria-hidden="true" className="h-4 w-4" />
      {isLoading ? "..." : "Abmelden"}
    </button>
  );
}
