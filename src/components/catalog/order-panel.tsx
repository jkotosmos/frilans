"use client";

import { useState } from "react";
import { Check, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { PACKAGE_TIER_LABELS, type PackageTier } from "@/lib/constants";
import { demoAction } from "@/lib/demo-actions";

interface PackageData {
  id: string;
  tier: string;
  title: string;
  description: string;
  priceCents: number;
  deliveryDays: number;
  revisions: number;
  features: string;
}

export function OrderPanel({ packages, isOwnService }: { packages: PackageData[]; isOwnService: boolean }) {
  const sorted = [...packages].sort((a, b) => a.priceCents - b.priceCents);
  const [selectedId, setSelectedId] = useState(sorted[1]?.id ?? sorted[0]?.id);
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = sorted.find((p) => p.id === selectedId) ?? sorted[0]!;
  const features = selected.features.split(",").map((f) => f.trim()).filter(Boolean);

  function onOrder() {
    setLoading(true);
    demoAction();
    setLoading(false);
  }

  return (
    <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-cream-50 shadow-card">
      <div className="grid grid-cols-3 border-b border-ink-100">
        {sorted.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setSelectedId(pkg.id)}
            className={cn(
              "px-2 py-3 text-center text-sm font-medium transition-colors",
              selectedId === pkg.id ? "bg-rust-500 text-cream-50" : "text-ink-500 hover:bg-ink-50"
            )}
          >
            {PACKAGE_TIER_LABELS[pkg.tier as PackageTier] ?? pkg.title}
          </button>
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-900">{selected.title}</h3>
          <span className="font-display text-2xl font-semibold text-ink-900">{formatPrice(selected.priceCents)}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{selected.description}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" /> {selected.deliveryDays} дн.
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCw className="size-4" /> {selected.revisions} правок
          </span>
        </div>

        <ul className="mt-4 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
              <Check className="mt-0.5 size-4 shrink-0 text-pine-600" /> {f}
            </li>
          ))}
        </ul>

        {!isOwnService && (
          <>
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              maxLength={2000}
              placeholder="Опишите задачу для исполнителя (необязательно)"
              className="mt-4 min-h-[88px]"
            />
            <Button onClick={onOrder} loading={loading} className="mt-4 w-full" size="lg">
              Заказать за {formatPrice(selected.priceCents)}
            </Button>
            <p className="mt-2 text-center text-xs text-ink-300">Оплата резервируется на платформе до приёмки работы</p>
          </>
        )}
        {isOwnService && (
          <p className="mt-4 rounded-lg bg-ink-50 px-3 py-2.5 text-center text-sm text-ink-400">Это ваша услуга</p>
        )}
      </div>
    </div>
  );
}
