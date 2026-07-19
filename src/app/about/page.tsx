import type { Metadata } from "next";
import Link from "next/link";
import { PenTool, Code2, ShieldCheck, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "О платформе" };

const team = [
  {
    icon: PenTool,
    role: "Дизайн",
    text: "Отвечает за то, чтобы каталог, заказ и переписка ощущались понятно с первого клика — без лишних экранов и объяснений.",
  },
  {
    icon: Code2,
    role: "Разработка",
    text: "Строит саму биржу: каталог, заказы, сообщения, оплату — так, чтобы всё это надёжно работало под нагрузкой и росло вместе с платформой.",
  },
  {
    icon: ShieldCheck,
    role: "Безопасность",
    text: "Проверяет каждое решение на предмет рисков: как хранятся пароли, как защищены сделки, что может пойти не так и как это предотвратить заранее.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-ink-100 bg-cream-100 py-16">
          <div className="container max-w-3xl">
            <h1 className="font-display text-4xl font-semibold text-ink-900">Артель</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              «Артель» — старое слово для добровольного объединения мастеров, которые работают вместе и отвечают друг за
              друга репутацией. Мы построили современную биржу фриланса вокруг того же принципа: независимые специалисты и
              заказчики находят друг друга, а платформа отвечает за то, чтобы сделка прошла честно.
            </p>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Как мы работали над платформой</h2>
          <p className="mt-3 max-w-2xl text-ink-500">
            Артель делали как небольшая команда, а не как один универсальный инструмент — каждая роль отвечала за свою
            часть продукта.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {team.map((t) => (
              <div key={t.role} className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
                <span className="flex size-11 items-center justify-center rounded-lg bg-rust-50 text-rust-500">
                  <t.icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-medium text-ink-900">{t.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cream-100/60 py-16">
          <div className="container max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-ink-900">Важная оговорка</h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              Это демонстрационный проект: каталог, заказы, оплата и переписка работают по-настоящему на уровне
              приложения, но платёж в них — учебная симуляция, а не реальное списание средств. Перед запуском в
              продакшене подключите настоящего платёжного провайдера и проведите независимый аудит безопасности.
            </p>
          </div>
        </section>

        <section className="container py-16 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Готовы попробовать?</h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/services">
              <Button>
                Смотреть каталог <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Создать аккаунт</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
