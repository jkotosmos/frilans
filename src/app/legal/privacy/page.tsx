import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "Политика конфиденциальности" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container max-w-3xl py-16">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Политика конфиденциальности</h1>
        <p className="mt-2 text-sm text-ink-400">Последнее обновление: демонстрационная версия документа</p>

        <div className="mt-6 rounded-xl2 border border-gold-300/40 bg-gold-300/10 p-4 text-sm text-ink-700">
          Это шаблонный текст для демонстрационного проекта. Перед реальным запуском согласуйте политику с юристом и
          приведите её в соответствие с применимым законодательством о персональных данных.
        </div>

        <div className="mt-8 space-y-8 text-ink-600">
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">Какие данные мы собираем</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed">
              <li>Имя и email при регистрации</li>
              <li>Данные профиля исполнителя: профессия, описание, навыки, портфолио</li>
              <li>Содержание заказов и переписки на платформе</li>
              <li>Технические данные: IP-адрес — используется только для защиты от подбора пароля и злоупотреблений</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">Как мы используем данные</h2>
            <p className="mt-2 leading-relaxed">
              Данные используются исключительно для работы платформы: авторизации, отображения профилей, обработки
              заказов и коммуникации между сторонами. Мы не продаём персональные данные третьим лицам.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">Как мы храним данные</h2>
            <p className="mt-2 leading-relaxed">
              Пароли хранятся в виде необратимых хэшей и никогда не хранятся в открытом виде. Доступ к базе данных
              ограничен и не публикуется в открытом репозитории проекта.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-ink-900">Ваши права</h2>
            <p className="mt-2 leading-relaxed">
              Вы можете в любой момент запросить изменение или удаление своих данных, написав на{" "}
              <a href="mailto:privacy@artel.example" className="text-rust-600 underline">
                privacy@artel.example
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
