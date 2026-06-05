"use client";

import clsx from "clsx";
import { Brain, CalendarDays, ListChecks, MessageCircle, Mic } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/types";

const navItems: NavItem[] = [
  { href: "/capture", label: "Capture", icon: Mic },
  { href: "/today", label: "Heute", icon: CalendarDays },
  { href: "/memory", label: "Memory", icon: Brain },
  { href: "/loops", label: "Loops", icon: ListChecks },
  { href: "/chat", label: "Chat", icon: MessageCircle }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hauptnavigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-paper/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_35px_rgba(23,23,23,0.07)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-md text-[0.7rem] font-medium transition-colors",
                isActive
                  ? "bg-ink text-paper"
                  : "text-neutral-500 hover:bg-black/[0.04] hover:text-ink"
              )}
            >
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
