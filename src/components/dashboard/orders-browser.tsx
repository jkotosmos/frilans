"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { PackageSearch } from "lucide-react";
import { getDemoUser, getOrdersForUser } from "@/lib/static-data";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { formatPrice, formatRelativeDate, cn } from "@/lib/utils";

// Client component, not a Server Component reading `searchParams`: the
// static export has no server to read a request's query string from — see
// components/catalog/catalog-browser.tsx for the same pattern on /services.
export function OrdersBrowser() {
  const searchParams = useSearchParams();
  const user = getDemoUser();
  const as = searchParams.get("as") === "seller" && user.role === "FREELANCER" ? "seller" : "client";
  const orders = useMemo(() => getOrdersForUser(user.id, as), [user.id, as]);

  return (
    <>
      {user.role === "FREELANCER" && (
        <div className="mt-4 inline-flex rounded-full border border-ink-100 bg-cream-50 p-1">
          <Link
            href="/dashboard/orders?as=client"
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium", as === "client" ? "bg-rust-500 text-cream-50" : "text-ink-600")}
          >
            Я заказчик
          </Link>
          <Link
            href="/dashboard/orders?as=seller"
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium", as === "seller" ? "bg-rust-500 text-cream-50" : "text-ink-600")}
          >
            Я исполнитель
          </Link>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl2 border border-ink-100 bg-cream-50 shadow-card">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <PackageSearch className="size-9 text-ink-300" />
            <p className="mt-3 text-sm text-ink-400">Заказов пока нет</p>
          </div>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="flex flex-col gap-2 border-b border-ink-100 p-5 transition-colors last:border-0 hover:bg-ink-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{order.service.title}</p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {as === "client" ? `Исполнитель: ${order.seller.name}` : `Заказчик: ${order.client.name}`} ·{" "}
                      <span suppressHydrationWarning>{formatRelativeDate(order.updatedAt)}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-medium text-ink-900">{formatPrice(order.priceCents)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
