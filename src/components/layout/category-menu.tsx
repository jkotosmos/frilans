"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { iconFor } from "@/lib/icons";

interface CategoryMenuProps {
  categories: { slug: string; name: string; description: string | null; icon: string }[];
}

export function CategoryMenu({ categories }: CategoryMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-[0.95rem] font-medium text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900"
      >
        Категории
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-[560px] rounded-xl2 border border-ink-100 bg-cream-50 p-3 shadow-card-hover animate-fade-up">
          <div className="grid grid-cols-2 gap-1">
            {categories.map((cat) => {
              const Icon = iconFor(cat.icon);
              return (
                <Link
                  key={cat.slug}
                  href={`/services?category=${cat.slug}`}
                  className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-ink-50"
                  onClick={() => setOpen(false)}
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-rust-50 text-rust-500">
                    <Icon className="size-[18px]" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink-900">{cat.name}</span>
                    <span className="block text-xs text-ink-400">{cat.description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
