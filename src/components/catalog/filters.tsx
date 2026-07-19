"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FiltersProps {
  categories: { slug: string; name: string }[];
}

const SORT_OPTIONS = [
  { value: "popular", label: "По популярности" },
  { value: "rating", label: "По рейтингу" },
  { value: "new", label: "Сначала новые" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
];

export function Filters({ categories }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");

  function pushParams(next: Record<string, string | null>) {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") query.delete(key);
      else query.set(key, value);
    }
    query.delete("page");
    startTransition(() => router.push(`${pathname}?${query.toString()}`));
  }

  const activeCategory = params.get("category");

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-ink-700">Сортировка</h3>
        <Select value={params.get("sort") ?? "popular"} onChange={(e) => pushParams({ sort: e.target.value })}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-ink-700">Категория</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => pushParams({ category: null })}
            className={cn(
              "rounded-lg px-3 py-2 text-left text-sm transition-colors",
              !activeCategory ? "bg-rust-50 font-medium text-rust-700" : "text-ink-600 hover:bg-ink-50"
            )}
          >
            Все категории
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => pushParams({ category: cat.slug })}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeCategory === cat.slug ? "bg-rust-50 font-medium text-rust-700" : "text-ink-600 hover:bg-ink-50"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-ink-700">Цена, ₽</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="От"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-10 w-full rounded-lg border border-ink-200 bg-cream-50 px-3 text-sm outline-none focus:border-rust-400 focus:ring-2 focus:ring-rust-100"
          />
          <span className="text-ink-300">—</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="До"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-10 w-full rounded-lg border border-ink-200 bg-cream-50 px-3 text-sm outline-none focus:border-rust-400 focus:ring-2 focus:ring-rust-100"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => pushParams({ minPrice: minPrice || null, maxPrice: maxPrice || null })}
        >
          Применить
        </Button>
      </div>

      {(activeCategory || params.get("minPrice") || params.get("maxPrice") || params.get("q")) && (
        <Button variant="ghost" size="sm" className="w-full text-ink-500" onClick={() => router.push(pathname)}>
          Сбросить фильтры
        </Button>
      )}
    </aside>
  );
}
