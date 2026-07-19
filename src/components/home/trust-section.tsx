import Link from "next/link";
import { ShieldCheck, Lock, UserCheck, Scale } from "lucide-react";

const points = [
  {
    icon: Lock,
    title: "Защищённые сделки",
    text: "Оплата удерживается платформой и раскрывается исполнителю только после приёмки работы заказчиком.",
  },
  {
    icon: UserCheck,
    title: "Проверка исполнителей",
    text: "Отмеченные значком аккаунты прошли верификацию личности и портфолио службой доверия и безопасности.",
  },
  {
    icon: Scale,
    title: "Разрешение споров",
    text: "Если что-то пошло не так — модераторы разбирают ситуацию и принимают решение по фактам переписки и работы.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="rounded-xl2 border border-ink-100 bg-cream-50 p-8 shadow-card sm:p-10">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-pine-100 text-pine-700">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">Безопасность — не галочка, а архитектура</h2>
                <p className="mt-1 max-w-xl text-ink-500">
                  Мы проектировали Артель вместе со специалистом по безопасности с первого дня, а не добавляли защиту постфактум.
                </p>
              </div>
            </div>
            <Link href="/safety" className="shrink-0 text-sm font-medium text-rust-600 hover:underline">
              Подробнее о защите →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {points.map((p) => (
              <div key={p.title}>
                <p.icon className="size-5 text-rust-500" strokeWidth={1.75} />
                <h3 className="mt-3 font-medium text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
