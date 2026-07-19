"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, LayoutDashboard, MessageSquare, Settings, LogOut, Heart, Briefcase } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (status === "loading") {
    return <div className="size-10 animate-pulse rounded-full bg-ink-100" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Войти
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm">
            Регистрация
          </Button>
        </Link>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 transition-colors hover:border-ink-100 hover:bg-ink-50"
      >
        <Avatar seed={user.id} name={user.name} size="sm" />
        <ChevronDown className="size-4 text-ink-400" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-ink-100 bg-cream-50 shadow-card-hover animate-fade-up">
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="truncate font-medium text-ink-900">{user.name}</p>
            <p className="truncate text-sm text-ink-300">{user.email}</p>
          </div>
          <nav className="flex flex-col p-1.5 text-sm">
            <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-50" onClick={() => setOpen(false)}>
              <LayoutDashboard className="size-4" /> Кабинет
            </Link>
            {user.role === "FREELANCER" && (
              <Link href="/dashboard/services" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-50" onClick={() => setOpen(false)}>
                <Briefcase className="size-4" /> Мои услуги
              </Link>
            )}
            <Link href="/dashboard/messages" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-50" onClick={() => setOpen(false)}>
              <MessageSquare className="size-4" /> Сообщения
            </Link>
            <Link href="/dashboard/favorites" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-50" onClick={() => setOpen(false)}>
              <Heart className="size-4" /> Избранное
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-50" onClick={() => setOpen(false)}>
              <Settings className="size-4" /> Настройки
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-rust-600 hover:bg-rust-50"
            >
              <LogOut className="size-4" /> Выйти
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
