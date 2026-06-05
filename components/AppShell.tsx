import { BottomNav } from "@/components/BottomNav";
import { LogoutButton } from "@/components/LogoutButton";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
};

export function AppShell({ children, title, eyebrow }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-mist">
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-28 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-sage">Second Brain</p>
          <LogoutButton />
        </div>
        {(title || eyebrow) && (
          <header className="mb-6">
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase text-sage">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-3xl font-semibold leading-tight text-ink">{title}</h1>
            )}
          </header>
        )}
        <div className="flex flex-1 flex-col">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
