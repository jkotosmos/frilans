"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { SearchX } from "lucide-react";
import { Filters } from "@/components/catalog/filters";
import { ServiceCard } from "@/components/catalog/service-card";
import { getFilteredServices } from "@/lib/static-data";
import { serviceFiltersSchema } from "@/lib/validations/service";
import { cn } from "@/lib/utils";

interface CatalogBrowserProps {
  categories: { slug: string; name: string }[];
}

/**
 * A static export has no server to read the request's query string on
 * (`searchParams` in a Server Component isn't supported by `output: export`
 * — see DEPLOYMENT.md), so catalog filtering happens entirely client-side:
 * `getFilteredServices` runs the exact same logic it always did, just called
 * from the browser instead of at request time. The category grid at build
 * time already brought every published service into the client bundle via
 * seed-data.json, so this is instant either way.
 */
export function CatalogBrowser({ categories }: CatalogBrowserProps) {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const parsed = serviceFiltersSchema.safeParse({
      category: searchParams.get("category") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
    });
    return parsed.success ? parsed.data : {};
  }, [searchParams]);

  const result = useMemo(() => getFilteredServices(filters), [filters]);
  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink-900">
          {activeCategory ? activeCategory.name : filters.q ? `Поиск: «${filters.q}»` : "Каталог услуг"}
        </h1>
        <p className="mt-1 text-ink-500">{result.total} услуг найдено</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <Filters categories={categories} />

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
                  {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
                    const query = new URLSearchParams(searchParams.toString());
                    query.set("page", String(p));
                    return (
                      <Link
                        key={p}
                        href={`?${query.toString()}`}
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                          p === result.page ? "bg-rust-500 text-cream-50" : "text-ink-600 hover:bg-ink-100"
                        )}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
