import type { Metadata } from "next";
import { Suspense } from "react";
import { OrdersBrowser } from "@/components/dashboard/orders-browser";

export const metadata: Metadata = { title: "Мои заказы" };

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Мои заказы</h1>
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-xl2 bg-ink-50" />}>
        <OrdersBrowser />
      </Suspense>
    </div>
  );
}
