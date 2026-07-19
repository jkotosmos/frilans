import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Создать аккаунт"
      subtitle="Присоединяйтесь к артели — это бесплатно"
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-rust-600 hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
