import Link from "next/link";
import { Logo } from "./logo";
import { ShieldCheck, Mail } from "lucide-react";

const columns = [
  {
    title: "Маркетплейс",
    links: [
      { href: "/services", label: "Каталог услуг" },
      { href: "/freelancers", label: "Исполнители" },
      { href: "/register?role=FREELANCER", label: "Стать исполнителем" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { href: "/how-it-works", label: "Как это работает" },
      { href: "/safety", label: "Безопасность и гарантии" },
      { href: "/about", label: "О платформе" },
    ],
  },
  {
    title: "Правовая информация",
    links: [
      { href: "/legal/terms", label: "Условия использования" },
      { href: "/legal/privacy", label: "Политика конфиденциальности" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-100">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="[&_span]:text-cream-50" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
              Гильдия независимых мастеров и заказчиков. Находим друг друга, работаем честно, растим дело вместе.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-full bg-ink-900 px-3.5 py-2 text-xs text-pine-300 w-fit">
              <ShieldCheck className="size-4" />
              Безопасные сделки с защитой оплаты
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-medium text-ink-300">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-100 transition-colors hover:text-rust-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-800 pt-6 text-xs text-ink-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Артель. Учебный демонстрационный проект.</p>
          <a href="mailto:support@artel.example" className="flex items-center gap-1.5 hover:text-cream-50">
            <Mail className="size-3.5" /> support@artel.example
          </a>
        </div>
      </div>
    </footer>
  );
}
