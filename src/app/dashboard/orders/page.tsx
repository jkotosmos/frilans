import Link from "next/link";
import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { formatPrice, formatRelativeDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Мои заказы" };

export default async function OrdersPage({ searchParams }: { searchParams: { as?: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const as = searchParams.as === "seller" && user.role === "FREELANCER" ? "seller" : "client";

  const orders = await db.order.findMany({
    where: as === "client" ? { clientId: user.id } : { sellerId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      service: { select: { title: true, slug: true } },
      client: { select: { name: true, id: true } },
      seller: { select: { name: true, id: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Мои заказы</h1>

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
                      {formatRelativeDate(order.updatedAt)}
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
    </div>
  );
}
