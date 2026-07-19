import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Package, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { OrderActions } from "@/components/dashboard/order-actions";
import { ReviewForm } from "@/components/dashboard/review-form";
import { MessageButton } from "@/components/catalog/message-button";
import { Rating } from "@/components/ui/rating";
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_TRANSITIONS } from "@/lib/order-transitions";
import type { OrderStatus } from "@/lib/constants";

export const metadata: Metadata = { title: "Заказ" };

const ACTION_LABELS: Partial<Record<OrderStatus, { label: string; variant?: "primary" | "outline" | "danger"; confirm?: string }>> = {
  IN_PROGRESS: { label: "Оплатить (демо)", variant: "primary" },
  DELIVERED: { label: "Сдать работу", variant: "primary" },
  COMPLETED: { label: "Принять работу", variant: "primary" },
  REVISION_REQUESTED: { label: "Запросить доработку", variant: "outline" },
  CANCELLED: { label: "Отменить заказ", variant: "danger", confirm: "Точно отменить заказ?" },
  DISPUTED: { label: "Открыть спор", variant: "outline", confirm: "Спор передаст заказ на рассмотрение службы поддержки. Продолжить?" },
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      service: { select: { title: true, slug: true } },
      package: true,
      client: { select: { id: true, name: true, avatarSeed: true } },
      seller: { select: { id: true, name: true, avatarSeed: true } },
      review: true,
    },
  });

  if (!order) notFound();
  const isClient = order.clientId === user.id;
  const isSeller = order.sellerId === user.id;
  if (!isClient && !isSeller) notFound();

  const counterpart = isClient ? order.seller : order.client;
  const possible = ORDER_TRANSITIONS[order.status as OrderStatus];
  const actions = possible
    .filter((t) => t.by === "either" || (t.by === "client" && isClient) || (t.by === "seller" && isSeller))
    .map((t) => ({ next: t.next, ...(ACTION_LABELS[t.next] ?? { label: t.next }) }));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-ink-400">Заказ #{order.id.slice(-8)}</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">{order.service.title}</h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Package className="size-4 text-ink-300" />
            Пакет: <span className="font-medium text-ink-800">{order.package.title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Calendar className="size-4 text-ink-300" />
            Создан: <span className="font-medium text-ink-800">{formatDate(order.createdAt)}</span>
          </div>
          <div className="text-sm text-ink-500">
            Сумма: <span className="font-display text-lg font-semibold text-ink-900">{formatPrice(order.priceCents)}</span>
          </div>
          <div className="text-sm text-ink-500">
            Срок исполнения: <span className="font-medium text-ink-800">{order.package.deliveryDays} дн.</span>
          </div>
        </div>

        {order.requirements && (
          <div className="mt-5 rounded-lg bg-ink-50 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">
              <FileText className="size-3.5" /> Требования заказчика
            </p>
            <p className="whitespace-pre-line text-sm text-ink-700">{order.requirements}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink-100 pt-5">
          {isClient ? (
            <Link href={`/freelancers/${counterpart.id}`} className="flex items-center gap-2.5">
              <Avatar seed={counterpart.avatarSeed} name={counterpart.name} size="sm" />
              <div>
                <p className="text-xs text-ink-400">Исполнитель</p>
                <p className="text-sm font-medium text-ink-800">{counterpart.name}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              <Avatar seed={counterpart.avatarSeed} name={counterpart.name} size="sm" />
              <div>
                <p className="text-xs text-ink-400">Заказчик</p>
                <p className="text-sm font-medium text-ink-800">{counterpart.name}</p>
              </div>
            </div>
          )}
          <MessageButton recipientId={counterpart.id} />
        </div>

        {actions.length > 0 && (
          <div className="mt-6 border-t border-ink-100 pt-5">
            <OrderActions orderId={order.id} actions={actions} />
          </div>
        )}
      </div>

      {order.status === "COMPLETED" && isClient && !order.review && (
        <div className="mt-6">
          <ReviewForm orderId={order.id} />
        </div>
      )}

      {order.review && (
        <div className="mt-6 rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
          <h3 className="font-medium text-ink-900">Ваш отзыв</h3>
          <Rating value={order.review.rating} showValue={false} stars className="mt-2" />
          <p className="mt-2 text-sm text-ink-600">{order.review.comment}</p>
        </div>
      )}
    </div>
  );
}
