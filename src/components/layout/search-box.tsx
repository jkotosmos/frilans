"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (value.trim()) query.set("q", value.trim());
    router.push(`/services${query.toString() ? `?${query.toString()}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className={className} role="search">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-300" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={120}
          placeholder="Найти услугу: логотип, лендинг, перевод…"
          className="h-11 w-full rounded-full border border-ink-200 bg-cream-50 pl-10 pr-4 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-300 focus:border-rust-400 focus:ring-2 focus:ring-rust-100"
        />
      </div>
    </form>
  );
}
