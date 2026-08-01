import Link from "next/link";
import { ShieldCheck, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { getHomeStats } from "@/lib/static-data";
import { Suspense } from "react";
import { SearchBox } from "@/components/layout/search-box";

export async function Hero() {
  const stats = getHomeStats();

  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-cream-100">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-60" aria-hidden />
      <div className="container relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rust-50 px-3 py-1.5 text-xs font-medium text-rust-600">
            <Sparkles className="size-3.5" /> Биржа фриланса нового поколения
          </span>
          <h1 className="mt-5 max-w-xl text-balance font-display text-4xl font-semibold leading-[1.1] text-ink-900 sm:text-5xl">
            Находите мастеров.<br /> Сдавайте проекты.<br /> Растите дело.
          </h1>
          <p className="mt-5 max-w-lg text-balance text-lg leading-relaxed text-ink-500">
            Артель — гильдия проверенных исполнителей и заказчиков. Оплата хранится на платформе
            до приёмки работы, а спорные ситуации разбирает служба поддержки.
          </p>

          <div className="mt-7 max-w-lg">
            <Suspense fallback={<div className="h-11 rounded-full bg-ink-100" />}>
              <SearchBox />
            </Suspense>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-400">
              <span>Популярное:</span>
              {["Логотип", "Лендинг", "SEO-текст", "Монтаж видео"].map((tag) => (
                <Link key={tag} href={`/services?q=${encodeURIComponent(tag)}`} className="underline decoration-ink-200 underline-offset-2 hover:text-rust-500 hover:decoration-rust-300">
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Stat value={`${stats.freelancers}+`} label="исполнителей" />
            <Stat value={`${stats.services}+`} label="активных услуг" />
            <Stat value={stats.avgRating.toFixed(1)} label="средний рейтинг" icon />
          </div>
        </div>

        <div className="relative hidden aspect-square lg:block">
          <HeroArt />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1 font-display text-2xl font-semibold text-ink-900">
        {icon && <Star className="size-5 fill-gold-500 text-gold-500" />}
        {value}
      </div>
      <div className="text-sm text-ink-400">{label}</div>
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <circle cx="200" cy="200" r="170" fill="none" stroke="#E9DCC5" strokeWidth="1" strokeDasharray="2 8" />
        <path
          d="M256 40C300 60 340 110 344 165C348 222 320 270 275 305C230 340 165 350 118 322C71 294 40 232 45 175C50 118 92 65 145 45C198 25 212 20 256 40Z"
          fill="url(#heroGrad)"
          opacity="0.9"
        />
        <defs>
          <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DD7233" />
            <stop offset="100%" stopColor="#2F5641" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute left-4 top-10 w-52 rounded-xl2 border border-ink-100 bg-cream-50/95 p-4 shadow-card-hover backdrop-blur animate-fade-up">
        <div className="flex items-center gap-1 text-gold-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-gold-500" />
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-700">«Сдали лендинг раньше срока, всё по ТЗ»</p>
        <p className="mt-1 text-xs text-ink-300">— Мария, заказчик</p>
      </div>

      <div className="absolute bottom-16 right-2 flex items-center gap-2 rounded-full border border-ink-100 bg-cream-50/95 px-4 py-3 shadow-card-hover backdrop-blur">
        <ShieldCheck className="size-5 text-pine-600" />
        <div className="text-sm">
          <p className="font-medium text-ink-800">Оплата защищена</p>
          <p className="text-xs text-ink-300">до приёмки работы</p>
        </div>
      </div>

      <div className="absolute bottom-2 left-10 flex items-center gap-2 rounded-full bg-pine-600 px-4 py-2.5 text-cream-50 shadow-card-hover">
        <CheckCircle2 className="size-4" />
        <span className="text-sm font-medium">Заказ принят</span>
      </div>
    </div>
  );
}
