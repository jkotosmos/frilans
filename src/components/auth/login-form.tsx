"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { demoAction } from "@/lib/demo-actions";

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    demoAction("Демо-версия на GitHub Pages: входа нет, вы уже смотрите сайт от имени демо-пользователя. Загляните в «Кабинет» в меню.");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required maxLength={200} placeholder="••••••••" />
      </div>
      <Button type="submit" className="w-full" loading={loading}>
        Войти
      </Button>
    </form>
  );
}
