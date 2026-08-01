"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoAction } from "@/lib/demo-actions";

export function FavoriteButton({ initialFavorited }: { serviceId: string; initialFavorited: boolean }) {
  const [loading, setLoading] = useState(false);

  function onClick() {
    setLoading(true);
    demoAction();
    setLoading(false);
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-pressed={initialFavorited}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border transition-colors disabled:opacity-50",
        initialFavorited ? "border-rust-200 bg-rust-50 text-rust-500" : "border-ink-200 text-ink-400 hover:border-rust-200 hover:text-rust-500"
      )}
      aria-label={initialFavorited ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <Heart className={cn("size-[18px]", initialFavorited && "fill-rust-500")} />
    </button>
  );
}
