import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants";

export const createOrderSchema = z.object({
  packageId: z.string().min(1),
  requirements: z.string().trim().max(2000).optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(ORDER_STATUSES),
});

export const reviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10, "Минимум 10 символов").max(1000),
});
