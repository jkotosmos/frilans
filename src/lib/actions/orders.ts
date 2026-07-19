"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { createOrderSchema, reviewSchema } from "@/lib/validations/order";
import { PLATFORM_FEE_PERCENT, type OrderStatus } from "@/lib/constants";
import { ORDER_TRANSITIONS } from "@/lib/order-transitions";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/lib/actions/auth";

export type CreateOrderResult = { ok: true; orderId: string } | { ok: false; error: string };

export async function createOrder(formData: FormData): Promise<CreateOrderResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт, чтобы оформить заказ" };

  const rl = checkRateLimit(`create-order:${user.id}`, 20, 60 * 60 * 1000);
  if (!rl.success) return { ok: false, error: "Слишком много заказов подряд. Попробуйте позже." };

  const parsed = createOrderSchema.safeParse({
    packageId: formData.get("packageId"),
    requirements: formData.get("requirements") || undefined,
  });
  if (!parsed.success) return { ok: false, error: "Проверьте данные заказа" };

  const pkg = await db.package.findUnique({ where: { id: parsed.data.packageId }, include: { service: true } });
  if (!pkg || pkg.service.status !== "PUBLISHED") return { ok: false, error: "Услуга недоступна" };
  if (pkg.service.sellerId === user.id) return { ok: false, error: "Нельзя заказать собственную услугу" };

  const order = await db.order.create({
    data: {
      serviceId: pkg.serviceId,
      packageId: pkg.id,
      clientId: user.id,
      sellerId: pkg.service.sellerId,
      priceCents: pkg.priceCents,
      requirements: parsed.data.requirements,
      status: "PENDING_PAYMENT",
    },
  });

  revalidatePath("/dashboard/orders");
  return { ok: true, orderId: order.id };
}

export async function transitionOrder(orderId: string, next: OrderStatus): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт" };

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, error: "Заказ не найден" };

  const isClient = order.clientId === user.id;
  const isSeller = order.sellerId === user.id;
  if (!isClient && !isSeller) return { ok: false, error: "Недостаточно прав" };

  const allowed = ORDER_TRANSITIONS[order.status as OrderStatus].find((t) => t.next === next);
  if (!allowed) return { ok: false, error: "Такой переход статуса недопустим" };
  if (allowed.by === "client" && !isClient) return { ok: false, error: "Действие доступно только заказчику" };
  if (allowed.by === "seller" && !isSeller) return { ok: false, error: "Действие доступно только исполнителю" };

  await db.$transaction(async (tx) => {
    await tx.order.update({ where: { id: orderId }, data: { status: next } });

    if (next === "COMPLETED") {
      const payoutCents = Math.round(order.priceCents * (1 - PLATFORM_FEE_PERCENT / 100));
      await tx.user.update({
        where: { id: order.sellerId },
        data: { balanceCents: { increment: payoutCents } },
      });
      await tx.service.update({
        where: { id: order.serviceId },
        data: { ordersCount: { increment: 1 } },
      });
    }
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  return { ok: true };
}

export async function leaveReview(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт" };

  const parsed = reviewSchema.safeParse({
    orderId: formData.get("orderId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте форму отзыва" };

  const order = await db.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return { ok: false, error: "Заказ не найден" };
  if (order.clientId !== user.id) return { ok: false, error: "Оставить отзыв может только заказчик" };
  if (order.status !== "COMPLETED") return { ok: false, error: "Отзыв можно оставить только для завершённого заказа" };

  const existingReview = await db.review.findUnique({ where: { orderId: order.id } });
  if (existingReview) return { ok: false, error: "Отзыв на этот заказ уже оставлен" };

  await db.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        orderId: order.id,
        serviceId: order.serviceId,
        authorId: user.id,
        targetId: order.sellerId,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });

    const agg = await tx.review.aggregate({
      where: { serviceId: order.serviceId },
      _avg: { rating: true },
      _count: true,
    });

    await tx.service.update({
      where: { id: order.serviceId },
      data: {
        rating: agg._avg.rating ?? parsed.data.rating,
        ratingCount: agg._count,
      },
    });
  });

  revalidatePath(`/dashboard/orders/${order.id}`);
  revalidatePath(`/services`);
  return { ok: true };
}
