"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Briefcase,
  Heart,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/constants";

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Обзор", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/orders", label: "Заказы", icon: ShoppingBag },
    { href: "/dashboard/messages", label: "Сообщения", icon: MessageSquare },
    ...(role === "FREELANCER" ? [{ href: "/dashboard/services", label: "Мои услуги", icon: Briefcase }] : []),
    { href: "/dashboard/favorites", label: "Избранное", icon: Heart },
    { href: "/dashboard/settings", label: "Настройки", icon: Settings },
  ];

  return (
    <>
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-ink-100 bg-cream-50 p-4 lg:flex">
        <Link href="/" prefetch={false} className="mb-6 flex items-center gap-1.5 px-2 text-sm text-ink-400 hover:text-ink-600">
          <ArrowLeft className="size-3.5" /> На главную
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-rust-50 text-rust-700" : "text-ink-600 hover:bg-ink-50"
                )}
              >
                <link.icon className="size-[18px]" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="flex gap-1 overflow-x-auto border-b border-ink-100 bg-cream-50 px-3 py-2 lg:hidden">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active ? "bg-rust-50 text-rust-700" : "text-ink-600 hover:bg-ink-50"
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
