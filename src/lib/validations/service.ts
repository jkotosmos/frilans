import { z } from "zod";
import { MAX_PRICE_RUB, MIN_PRICE_RUB, PACKAGE_TIERS } from "@/lib/constants";

export const packageInputSchema = z.object({
  tier: z.enum(PACKAGE_TIERS),
  title: z.string().trim().min(3).max(60),
  description: z.string().trim().min(3).max(300),
  priceRub: z.coerce.number().int().min(MIN_PRICE_RUB).max(MAX_PRICE_RUB),
  deliveryDays: z.coerce.number().int().min(1).max(180),
  revisions: z.coerce.number().int().min(0).max(50),
  features: z.string().trim().min(1).max(600),
});

export const serviceInputSchema = z.object({
  title: z.string().trim().min(10, "Минимум 10 символов").max(100),
  description: z.string().trim().min(40, "Опишите услугу подробнее (от 40 символов)").max(4000),
  categoryId: z.string().min(1, "Выберите категорию"),
  coverSeed: z.string().trim().min(1).max(80).optional(),
  packages: z.array(packageInputSchema).min(1).max(3),
});
export type ServiceInput = z.infer<typeof serviceInputSchema>;

export const serviceFiltersSchema = z.object({
  category: z.string().trim().max(80).optional(),
  q: z.string().trim().max(120).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["popular", "rating", "price_asc", "price_desc", "new"]).optional(),
  page: z.coerce.number().int().min(1).max(1000).optional(),
});
