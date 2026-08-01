import Link from "next/link";
import { getCategoriesWithServiceCount } from "@/lib/static-data";
import { iconFor } from "@/lib/icons";

export async function CategoryGrid() {
  const categories = getCategoriesWithServiceCount();

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Категории услуг</h2>
          <Link href="/services" className="text-sm font-medium text-rust-600 hover:underline">
            Все услуги →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = iconFor(cat.icon);
            return (
              <Link
                key={cat.slug}
                href={`/services?category=${cat.slug}`}
                className="group flex flex-col gap-3 rounded-xl2 border border-ink-100 bg-cream-50 p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-rust-200 hover:shadow-card-hover"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-rust-50 text-rust-500 transition-colors group-hover:bg-rust-500 group-hover:text-cream-50">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-medium text-ink-900">{cat.name}</h3>
                  <p className="mt-0.5 text-xs text-ink-400">{cat._count.services} услуг</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
