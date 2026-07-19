import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-10 text-cream-50 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-50" aria-hidden />
        <Logo className="relative [&_span]:text-cream-50" />
        <div className="relative max-w-md">
          <div className="mb-4 flex items-center gap-1 text-gold-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-gold-400" />
            ))}
          </div>
          <p className="font-display text-2xl leading-snug">
            «Артель дала нам доступ к десяткам проверенных специалистов — быстрее и спокойнее, чем искать самим.»
          </p>
          <p className="mt-4 text-sm text-ink-300">Мария, руководитель маркетинга</p>
        </div>
        <div className="relative flex items-center gap-2.5 rounded-xl2 border border-ink-800 bg-ink-900/60 p-4 text-sm text-ink-300">
          <ShieldCheck className="size-5 shrink-0 text-pine-400" />
          Ваши данные защищены: пароли хранятся в виде необратимых хэшей, оплата резервируется до приёмки работы.
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-center text-sm text-ink-500">{footer}</div>
        </div>
      </div>
    </div>
  );
}
