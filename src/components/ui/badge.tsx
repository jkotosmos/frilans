import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "brand";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  info: "bg-[#EAF0F6] text-[#33566E]",
  success: "bg-pine-100 text-pine-700",
  warning: "bg-gold-300/30 text-gold-600",
  danger: "bg-rust-100 text-rust-700",
  brand: "bg-rust-500 text-cream-50",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
