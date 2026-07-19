import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "default" | "brand";
  className?: string;
}

export function StatCard({ icon: Icon, label, value, tone = "default", className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl2 border border-ink-100 bg-cream-50 p-5 shadow-card", className)}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            tone === "brand" ? "bg-rust-500 text-cream-50" : "bg-ink-50 text-ink-500"
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="font-display text-xl font-semibold text-ink-900">{value}</p>
          <p className="text-xs text-ink-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
