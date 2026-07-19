import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  stars?: boolean;
  className?: string;
}

export function Rating({ value, count, size = "sm", showValue = true, stars = false, className }: RatingProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-4.5";

  if (stars) {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <span className="inline-flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn(starSize, i < Math.round(value) ? "fill-gold-500 text-gold-500" : "fill-ink-100 text-ink-100")} />
          ))}
        </span>
        {showValue && <span className="text-sm font-semibold text-ink-800">{value.toFixed(1)}</span>}
        {typeof count === "number" && <span className="text-sm text-ink-300">({count})</span>}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star className={cn(starSize, "fill-gold-500 text-gold-500")} />
      {showValue && <span className="text-sm font-semibold text-ink-800">{value.toFixed(1)}</span>}
      {typeof count === "number" && <span className="text-sm text-ink-300">({count})</span>}
    </span>
  );
}
