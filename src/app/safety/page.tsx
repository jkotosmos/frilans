import type { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Scale,
  KeyRound,
  Eye,
  AlertTriangle,
  FileWarning,
  MessageSquareWarning,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "Безопасность" };

const pillars = [
  {
    icon: Lock,
    title: "Защита сделок",
    text: "Оплата заказа резервируется платформой в момент оформления и раскрывается исполнителю только после того, как заказчик подтвердит приёмку работы. Деньги не проходят напрямую между сторонами.",
  },
  {
    icon: UserCheck,
    title: "Верификация исполнителей",
    text: "Аккаунты со значком проверки прошли подтверждение личности и портфолио. Мы не гарантируем результат работы, но проверяем, что за аккаунтом стоит реальный человек.",
  },
  {
    icon: Scale,
    title: "Разрешение споров",
    text: "Если заказчик и исполнитель не могут договориться, любая сторона может открыть спор. Дальнейшая переписка и материалы заказа передаются в службу поддержки для решения по существу.",
  },
  {
    icon: KeyRound,
    title: "Защита аккаунта",
    text: "Пароли хранятся в виде необратимых хэшей (bcrypt) — даже сотрудники платформы не могут их увидеть. Мы ограничиваем количество попыток входа, чтобы затруднить подбор пароля.",
  },
  {
    icon: Eye,
    title: "Минимум лишних данных",
    text: "Мы запрашиваем только то, что нужно для работы платформы: имя, email и профиль исполнителя. Данные банковских карт платформа не хранит.",
  },
  {
    icon: ShieldCheck,
    title: "Безопасное соединение",
    text: "Весь трафик между вами и платформой защищён современными заголовками безопасности (строгая политика контента, защита от кликджекинга и XSS).",
  },
];

const tips = [
  "Ведите все переговоры и оплату внутри платформы — вне её вы теряете защиту сделки и поддержку в спорах.",
  "Не переводите предоплату напрямую на карту или кошелёк — платформа для этого и существует.",
  "Проверяйте портфолио, отзывы и дату регистрации исполнителя перед крупным заказом.",
  "Не публикуйте пароли, коды из SMS или данные карт в сообщениях — служба поддержки никогда их не запрашивает.",
  "Если что-то выглядит подозрительно — сразу открывайте спор или пишите в поддержку, не дожидаясь эскалации.",
];

export default function SafetyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-ink-100 bg-ink-950 py-16 text-cream-50">
          <div className="container">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-medium text-pine-300">
              <ShieldCheck className="size-3.5" /> Доверие и безопасность
            </span>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight">
              Безопасность — это архитектура, а не галочка в форме
            </h1>
            <p className="mt-4 max-w-2xl text-ink-300">
              Артель проектировалась с участием специалиста по безопасности с первого дня: от модели данных и хранения
              паролей до логики защищённых сделок. Ниже — что именно мы делаем и что стоит делать вам.
            </p>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="mb-8 font-display text-2xl font-semibold text-ink-900">Что защищает платформа</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
                <span className="flex size-11 items-center justify-center rounded-lg bg-pine-100 text-pine-700">
                  <p.icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-medium text-ink-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cream-100/60 py-16">
          <div className="container grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink-900">Как проходит спор</h2>
              <p className="mt-3 leading-relaxed text-ink-600">
                Открыть спор может заказчик или исполнитель на любом активном заказе. С этого момента:
              </p>
              <ol className="mt-4 space-y-3 text-sm text-ink-600">
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rust-100 text-xs font-semibold text-rust-700">1</span>
                  Заказ помечается статусом «Спор», автоматические переходы статуса блокируются.
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rust-100 text-xs font-semibold text-rust-700">2</span>
                  Служба поддержки изучает переписку, требования заказа и результат работы.
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rust-100 text-xs font-semibold text-rust-700">3</span>
                  Принимается решение: завершить заказ, вернуть оплату заказчику или согласовать доработку.
                </li>
              </ol>
            </div>
            <div className="rounded-xl2 border border-ink-100 bg-cream-50 p-8 shadow-card">
              <div className="mb-4 flex items-center gap-2 text-rust-600">
                <AlertTriangle className="size-5" />
                <h2 className="font-display text-xl font-semibold text-ink-900">Как не попасть на мошенников</h2>
              </div>
              <ul className="space-y-3">
                {tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rust-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex gap-4 rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
              <FileWarning className="size-6 shrink-0 text-rust-500" />
              <div>
                <h3 className="font-medium text-ink-900">Нашли уязвимость?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  Мы будем благодарны за ответственное раскрытие. Напишите на{" "}
                  <a href="mailto:security@artel.example" className="text-rust-600 underline">
                    security@artel.example
                  </a>{" "}
                  с описанием проблемы и шагами воспроизведения — не публикуйте детали публично до исправления.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
              <MessageSquareWarning className="size-6 shrink-0 text-rust-500" />
              <div>
                <h3 className="font-medium text-ink-900">Столкнулись с нарушением?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  Если заказчик или исполнитель нарушает условия использования — откройте спор по заказу или напишите в
                  поддержку на{" "}
                  <a href="mailto:support@artel.example" className="text-rust-600 underline">
                    support@artel.example
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
