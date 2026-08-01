import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingBag, Wallet, Heart, Clock, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getDashboardOverview } from "@/lib/queries/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { formatPrice, formatRelativeDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Личный кабинет" };

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const stats = await getDashboardOverview(user.id, user.role);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Здравствуйте, {user.name.split(" ")[0]}!</h1>
      <p className="mt-1 text-ink-500">Вот что происходит с вашими заказами сегодня</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Clock} label="Активные заказы" value={String(stats.activeAsClient + stats.activeAsSeller)} tone="brand" />
        <StatCard icon={ShoppingBag} label="Всего заказов" value={String(stats.asClientCount + stats.asSellerCount)} />
        {user.role === "FREELANCER" && <StatCard icon={Wallet} label="Баланс (демо)" value={formatPrice(stats.balanceCents)} />}
        <StatCard icon={Heart} label="В избранном" value={String(stats.favoritesCount)} />
      </div>

      <div className="mt-8 rounded-xl2 border border-ink-100 bg-cream-50 shadow-card">
        <div className="flex items-center justify-between border-b border-ink-100 p-5">
          <h2 className="font-medium text-ink-900">Последние заказы</h2>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-sm font-medium text-rust-600 hover:underline">
            Все заказы <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-400">Заказов пока нет</p>
        ) : (
          <ul>
            {stats.recentOrders.map((order) => {
              const isClient = order.clientId === user.id;
              return (
                <li key={order.id}>
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center justify-between gap-4 border-b border-ink-100 p-5 transition-colors last:border-0 hover:bg-ink-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{order.service.title}</p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {isClient ? `Исполнитель: ${order.seller.name}` : `Заказчик: ${order.client.name}`} ·{" "}
                        <span suppressHydrationWarning>{formatRelativeDate(order.updatedAt)}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-medium text-ink-900">{formatPrice(order.priceCents)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
