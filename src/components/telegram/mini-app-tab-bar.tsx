"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Users, CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Главная", icon: Home, exact: true },
  { href: "/services", label: "Каталог", icon: LayoutGrid },
  { href: "/freelancers", label: "Мастера", icon: Users },
  { href: "/dashboard", label: "Кабинет", icon: CircleUserRound },
];

/**
 * Bottom tab bar shown only inside the Telegram Mini App (see the
 * `telegram-only` class, toggled by the `data-telegram` attribute set in
 * app/layout.tsx). Telegram Mini Apps have no browser chrome to navigate
 * with, so this replaces the desktop navbar/footer (hidden via
 * `.telegram-hide` on those) as the primary way to move around the app.
 */
export function MiniAppTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="telegram-only fixed inset-x-0 bottom-0 z-40 items-stretch border-t border-ink-100 bg-cream-50/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Основная навигация"
    >
      {TABS.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.7rem] font-medium transition-colors",
              active ? "text-rust-600" : "text-ink-400"
            )}
          >
            <tab.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
