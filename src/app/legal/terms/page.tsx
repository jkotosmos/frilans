import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "Условия использования" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container max-w-3xl py-16">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Условия использования</h1>
        <p className="mt-2 text-sm text-ink-400">Последнее обновление: демонстрационная версия документа</p>

        <div className="mt-6 rounded-xl2 border border-gold-300/40 bg-gold-300/10 p-4 text-sm text-ink-700">
          Это шаблонный текст для демонстрационного проекта, а не юридически проверенный документ. Перед реальным
          запуском платформы согласуйте условия использования с юристом.
        </div>

        <div className="prose-like mt-8 space-y-8 text-ink-600">
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">1. Общие положения</h2>
            <p className="mt-2 leading-relaxed">
              Используя платформу «Артель», вы соглашаетесь с настоящими условиями. Платформа соединяет заказчиков и
              независимых исполнителей и не является стороной договора между ними — мы предоставляем инструменты для
              поиска, заказа и защищённой оплаты услуг.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">2. Регистрация и аккаунт</h2>
            <p className="mt-2 leading-relaxed">
              Вы обязаны указывать достоверные данные при регистрации и не передавать доступ к своему аккаунту третьим
              лицам. Вы несёте ответственность за все действия, совершённые под вашей учётной записью.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">3. Заказы и оплата</h2>
            <p className="mt-2 leading-relaxed">
              Оплата заказа резервируется платформой в момент оформления и передаётся исполнителю после подтверждения
              приёмки заказчиком. Платформа удерживает комиссию с исполнителя при завершении заказа согласно
              действующим тарифам.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">4. Споры</h2>
            <p className="mt-2 leading-relaxed">
              При разногласиях любая сторона вправе открыть спор по заказу. Решение принимается службой поддержки на
              основании переписки, требований к заказу и результата работы.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">5. Запрещённые действия</h2>
            <p className="mt-2 leading-relaxed">
              Запрещается публиковать заведомо ложную информацию, обходить систему оплаты платформы, размещать
              незаконный контент или использовать платформу для рассылки спама.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">6. Ограничение ответственности</h2>
            <p className="mt-2 leading-relaxed">
              Платформа не гарантирует качество услуг, оказываемых исполнителями, и не несёт ответственности за
              содержание услуг. Мы прилагаем усилия для проверки аккаунтов, но не можем гарантировать отсутствие
              недобросовестных пользователей.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
