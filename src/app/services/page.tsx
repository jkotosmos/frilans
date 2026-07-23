import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Filters } from "@/components/catalog/filters";
import { ServiceCard } from "@/components/catalog/service-card";
import { SearchBox } from "@/components/layout/search-box";
import { getCategories } from "@/lib/queries/categories";
import { getFilteredServices } from "@/lib/queries/services";
import { serviceFiltersSchema } from "@/lib/validations/service";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";

export const metadata: Metadata = { title: "Каталог услуг" };

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const parsed = serviceFiltersSchema.safeParse({
    category: searchParams.category,
    q: searchParams.q,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort,
    page: searchParams.page,
  });
  const filters = parsed.success ? parsed.data : {};

  const [categories, result] = await Promise.all([getCategories(), getFilteredServices(filters)]);

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <>
      <Navbar />
      <main className="container py-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-ink-900">
            {activeCategory ? activeCategory.name : filters.q ? `Поиск: «${filters.q}»` : "Каталог услуг"}
          </h1>
          <p className="mt-1 text-ink-500">{result.total} услуг найдено</p>
        </div>

        {/* Navbar carries this on desktop; repeated here for narrow viewports
            and for the Telegram Mini App, where the navbar is hidden entirely
            and this is the only way to search. */}
        <Suspense fallback={<div className="mb-6 h-11 rounded-full bg-ink-100 lg:hidden" />}>
          <SearchBox className="mb-6 lg:hidden" />
        </Suspense>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <Filters categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />

          <div>
            {result.items.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl2 border border-dashed border-ink-200 py-20 text-center">
                <SearchX className="size-10 text-ink-300" />
                <p className="mt-4 font-medium text-ink-700">Ничего не нашлось</p>
                <p className="mt-1 text-sm text-ink-400">Попробуйте изменить фильтры или запрос поиска</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {result.items.map((service) => (
                    <ServiceCard key={service.slug} service={service} />
                  ))}
                </div>

                {result.totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Постраничная навигация">
                    {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={{ query: { ...searchParamsToObject(searchParams), page: p } }}
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                          p === result.page ? "bg-rust-500 text-cream-50" : "text-ink-600 hover:bg-ink-100"
                        )}
                      >
                        {p}
                      </Link>
                    ))}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function searchParamsToObject(searchParams: Record<string, string | string[] | undefined>) {
  const obj: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") obj[key] = value;
  }
  return obj;
}
