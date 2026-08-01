"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { demoAction } from "@/lib/demo-actions";

export function ReviewForm({}: { orderId: string }) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    demoAction();
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl2 border border-ink-100 bg-cream-50 p-5 shadow-card">
      <h3 className="font-medium text-ink-900">Оставить отзыв</h3>
      <div className="mt-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = (hovered ?? rating) > i;
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setRating(i + 1)}
              aria-label={`${i + 1} из 5`}
            >
              <Star className={cn("size-6 transition-colors", filled ? "fill-gold-500 text-gold-500" : "fill-ink-100 text-ink-100")} />
            </button>
          );
        })}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        minLength={10}
        maxLength={1000}
        placeholder="Расскажите, как прошла работа с исполнителем"
        className="mt-3 min-h-[88px]"
      />
      <Button type="submit" loading={loading} className="mt-3">
        Отправить отзыв
      </Button>
    </form>
  );
}
