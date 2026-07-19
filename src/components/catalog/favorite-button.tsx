"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/services";

export function FavoriteButton({ serviceId, initialFavorited }: { serviceId: string; initialFavorited: boolean }) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const result = await toggleFavorite(serviceId);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setFavorited(result.favorited ?? !favorited);
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-pressed={favorited}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border transition-colors disabled:opacity-50",
        favorited ? "border-rust-200 bg-rust-50 text-rust-500" : "border-ink-200 text-ink-400 hover:border-rust-200 hover:text-rust-500"
      )}
      aria-label={favorited ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <Heart className={cn("size-[18px]", favorited && "fill-rust-500")} />
    </button>
  );
}
