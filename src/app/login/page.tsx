import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <AuthLayout
      title="С возвращением"
      subtitle="Войдите, чтобы продолжить работу с заказами и сообщениями"
      footer={
        <>
          Ещё нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-rust-600 hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-5 rounded-lg bg-ink-50 px-3.5 py-2.5 text-xs text-ink-400">
        Демо-доступ: любой email из семян базы (например, maria.petrova@artel.demo) и пароль{" "}
        <code className="rounded bg-ink-100 px-1 py-0.5 font-mono">Password123!</code>
      </p>
    </AuthLayout>
  );
}
