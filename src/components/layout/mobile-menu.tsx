"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { iconFor } from "@/lib/icons";
import { SearchBox } from "./search-box";

interface MobileMenuProps {
  categories: { slug: string; name: string; icon: string }[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Открыть меню"
        className="flex size-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-50"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-ink-950/40" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-cream-50 p-5 shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-ink-900">Меню</span>
              <button onClick={() => setOpen(false)} aria-label="Закрыть меню" className="flex size-9 items-center justify-center rounded-lg hover:bg-ink-100">
                <X className="size-5" />
              </button>
            </div>

            <Suspense fallback={<div className="mb-5 h-11 rounded-full bg-ink-100" />}>
              <SearchBox className="mb-5" />
            </Suspense>

            <nav className="flex flex-col gap-1 text-sm">
              <Link href="/services" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium text-ink-800 hover:bg-ink-50">
                Все услуги
              </Link>
              {categories.map((cat) => {
                const Icon = iconFor(cat.icon);
                return (
                  <Link
                    key={cat.slug}
                    href={`/services?category=${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-50"
                  >
                    <Icon className="size-4 text-rust-500" /> {cat.name}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-ink-100" />
              <Link href="/freelancers" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-50">
                Исполнители
              </Link>
              <Link href="/how-it-works" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-50">
                Как это работает
              </Link>
              <Link href="/safety" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-50">
                Безопасность
              </Link>
            </nav>

            <div className="my-4 h-px bg-ink-100" />

            {session ? (
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium text-ink-800 hover:bg-ink-50">
                  Кабинет
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg px-3 py-2.5 text-left text-rust-600 hover:bg-rust-50"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-ink-200 px-4 py-2.5 text-center text-sm font-medium text-ink-800"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-rust-500 px-4 py-2.5 text-center text-sm font-medium text-cream-50"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
