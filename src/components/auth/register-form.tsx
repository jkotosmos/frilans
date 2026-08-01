"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { demoAction } from "@/lib/demo-actions";

export function RegisterForm() {
  const params = useSearchParams();
  const initialRole = params.get("role") === "FREELANCER" ? "FREELANCER" : "CLIENT";

  const [role, setRole] = useState<"CLIENT" | "FREELANCER">(initialRole);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    demoAction("Демо-версия на GitHub Pages: регистрации нет, вы уже смотрите сайт от имени демо-пользователя. Загляните в «Кабинет» в меню.");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Я хочу</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("CLIENT")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
              role === "CLIENT" ? "border-rust-400 bg-rust-50 text-rust-700" : "border-ink-200 text-ink-500 hover:bg-ink-50"
            )}
          >
            <User className="size-4" /> заказывать услуги
          </button>
          <button
            type="button"
            onClick={() => setRole("FREELANCER")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
              role === "FREELANCER" ? "border-rust-400 bg-rust-50 text-rust-700" : "border-ink-200 text-ink-500 hover:bg-ink-50"
            )}
          >
            <Briefcase className="size-4" /> оказывать услуги
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="name">Имя</Label>
        <Input id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={60} placeholder="Как к вам обращаться" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={200} placeholder="Минимум 8 символов" />
        <p className="mt-1.5 text-xs text-ink-300">Минимум 8 символов, хотя бы одна буква и одна цифра</p>
      </div>
      <Button type="submit" className="w-full" loading={loading}>
        Создать аккаунт
      </Button>
      <p className="text-center text-xs leading-relaxed text-ink-300">
        Регистрируясь, вы соглашаетесь с{" "}
        <a href="/legal/terms" className="underline hover:text-ink-500">
          условиями использования
        </a>{" "}
        и{" "}
        <a href="/legal/privacy" className="underline hover:text-ink-500">
          политикой конфиденциальности
        </a>
        .
      </p>
    </form>
  );
}
