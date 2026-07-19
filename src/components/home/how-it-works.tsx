import { Search, MessageSquareText, ShieldCheck, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Выберите услугу",
    text: "Изучите портфолио, отзывы и пакеты услуг — от разовой задачи до комплексного проекта.",
  },
  {
    icon: MessageSquareText,
    title: "Обсудите детали",
    text: "Опишите задачу в сообщении исполнителю до заказа — уточните сроки и результат.",
  },
  {
    icon: ShieldCheck,
    title: "Оплатите безопасно",
    text: "Деньги резервируются на платформе и передаются исполнителю только после вашей приёмки.",
  },
  {
    icon: ThumbsUp,
    title: "Примите работу",
    text: "Проверьте результат, запросите правки при необходимости и оставьте отзыв.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-ink-900 py-16 text-cream-50">
      <div className="container">
        <div className="mb-10 max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Как это работает</h2>
          <p className="mt-2 text-ink-300">Четыре шага от идеи до готового результата — без рисков для заказчика.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-xl2 border border-ink-800 bg-ink-950/60 p-6">
              <span className="font-display text-4xl font-semibold text-ink-700">{String(i + 1).padStart(2, "0")}</span>
              <step.icon className="mt-3 size-6 text-rust-400" strokeWidth={1.75} />
              <h3 className="mt-4 font-medium text-cream-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
