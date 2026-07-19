import type { Metadata } from "next";
import Link from "next/link";
import { Search, MessageSquareText, ShieldCheck, ThumbsUp, Briefcase, FileEdit, Send, Wallet } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Как это работает" };

const clientSteps = [
  { icon: Search, title: "Найдите услугу или мастера", text: "Используйте каталог, фильтры по цене и категории или поиск, чтобы найти подходящего исполнителя. Смотрите портфолио и отзывы." },
  { icon: MessageSquareText, title: "Обсудите задачу", text: "Напишите исполнителю до заказа — уточните детали, сроки и стоимость. Хорошее ТЗ экономит время всем." },
  { icon: ShieldCheck, title: "Оформите заказ и оплатите", text: "Выберите пакет услуги и оплатите. Деньги резервируются платформой и не поступают исполнителю сразу." },
  { icon: ThumbsUp, title: "Примите работу", text: "Когда исполнитель сдаст работу, проверьте её. Всё устраивает — подтвердите приёмку. Нужны правки — запросите их в рамках пакета." },
];

const freelancerSteps = [
  { icon: Briefcase, title: "Создайте профиль исполнителя", text: "Заполните профессию, навыки и портфолио — это первое, на что смотрят заказчики." },
  { icon: FileEdit, title: "Опубликуйте услугу", text: "Опишите, что вы делаете, и настройте 1-3 пакета с разной ценой, сроком и объёмом работ." },
  { icon: Send, title: "Работайте над заказами", text: "Получайте заказы, обсуждайте детали в сообщениях и сдавайте готовую работу через платформу." },
  { icon: Wallet, title: "Получайте оплату", text: "После приёмки заказа деньги поступают на ваш баланс за вычетом комиссии платформы." },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-ink-100 bg-cream-100 py-14">
          <div className="container text-center">
            <h1 className="font-display text-4xl font-semibold text-ink-900">Как работает Артель</h1>
            <p className="mx-auto mt-3 max-w-xl text-ink-500">
              Понятный процесс для заказчиков и исполнителей — с защитой оплаты на каждом шаге.
            </p>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="mb-8 font-display text-2xl font-semibold text-ink-900">Если вы заказчик</h2>
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {clientSteps.map((step, i) => (
              <li key={step.title} className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
                <span className="font-display text-3xl font-semibold text-ink-200">{i + 1}</span>
                <step.icon className="mt-3 size-6 text-rust-500" strokeWidth={1.75} />
                <h3 className="mt-4 font-medium text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <Link href="/services">
              <Button>Смотреть каталог услуг</Button>
            </Link>
          </div>
        </section>

        <section className="bg-cream-100/60 py-16">
          <div className="container">
            <h2 className="mb-8 font-display text-2xl font-semibold text-ink-900">Если вы исполнитель</h2>
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {freelancerSteps.map((step, i) => (
                <li key={step.title} className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
                  <span className="font-display text-3xl font-semibold text-ink-200">{i + 1}</span>
                  <step.icon className="mt-3 size-6 text-pine-600" strokeWidth={1.75} />
                  <h3 className="mt-4 font-medium text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 text-center">
              <Link href="/register?role=FREELANCER">
                <Button variant="secondary">Стать исполнителем</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="mx-auto max-w-2xl rounded-xl2 border border-ink-100 bg-cream-50 p-8 shadow-card">
            <h2 className="font-display text-xl font-semibold text-ink-900">О пакетах услуг</h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              Каждая услуга на Артели может иметь до трёх пакетов — <strong>Базовый</strong>, <strong>Стандарт</strong> и{" "}
              <strong>Премиум</strong>. Они отличаются объёмом работ, сроком выполнения и количеством правок, чтобы вы могли
              выбрать вариант под свой бюджет и задачу — как в кофейне: эспрессо, капучино или латте, а не «один размер для всех».
            </p>
            <p className="mt-3 leading-relaxed text-ink-600">
              Комиссия платформы удерживается только с исполнителя при завершении заказа — заказчик всегда платит ровно ту
              цену, что указана в пакете.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
