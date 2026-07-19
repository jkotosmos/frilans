"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { serviceInputSchema } from "@/lib/validations/service";
import { slugify, hashSeed } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/lib/actions/auth";

async function uniqueSlug(base: string) {
  const root = slugify(base) || "uslugi";
  let candidate = root;
  let i = 1;
  while (await db.service.findUnique({ where: { slug: candidate } })) {
    candidate = `${root}-${i}`;
    i += 1;
  }
  return candidate;
}

function parsePackagesFromForm(formData: FormData) {
  const tiers = ["BASIC", "STANDARD", "PREMIUM"] as const;
  return tiers
    .map((tier) => {
      const title = formData.get(`${tier}_title`);
      if (!title || String(title).trim() === "") return null;
      return {
        tier,
        title: String(title),
        description: String(formData.get(`${tier}_description`) ?? ""),
        priceRub: formData.get(`${tier}_price`),
        deliveryDays: formData.get(`${tier}_delivery`),
        revisions: formData.get(`${tier}_revisions`),
        features: String(formData.get(`${tier}_features`) ?? ""),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

export async function createService(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт" };
  if (user.role !== "FREELANCER") return { ok: false, error: "Только исполнители могут создавать услуги" };

  const rl = checkRateLimit(`create-service:${user.id}`, 10, 60 * 60 * 1000);
  if (!rl.success) return { ok: false, error: "Слишком много новых услуг подряд. Попробуйте позже." };

  const parsed = serviceInputSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    packages: parsePackagesFromForm(formData),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте форму" };
  }

  const { title, description, categoryId, packages } = parsed.data;

  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (!category) return { ok: false, error: "Категория не найдена" };

  const slug = await uniqueSlug(title);
  const coverSeed = `${slug}-${hashSeed(title).toString(36)}`;

  const service = await db.service.create({
    data: {
      slug,
      title,
      description,
      categoryId,
      sellerId: user.id,
      coverSeed,
      status: "PUBLISHED",
      packages: {
        create: packages.map((p) => ({
          tier: p.tier,
          title: p.title,
          description: p.description,
          priceCents: Math.round(p.priceRub * 100),
          deliveryDays: p.deliveryDays,
          revisions: p.revisions,
          features: p.features,
        })),
      },
    },
  });

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
  revalidatePath(`/services/${service.slug}`);

  return { ok: true };
}

export async function updateService(serviceId: string, formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт" };

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service) return { ok: false, error: "Услуга не найдена" };
  if (service.sellerId !== user.id) return { ok: false, error: "Недостаточно прав" };

  const parsed = serviceInputSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    packages: parsePackagesFromForm(formData),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте форму" };
  }

  const { title, description, categoryId, packages } = parsed.data;

  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (!category) return { ok: false, error: "Категория не найдена" };

  // Upsert per tier instead of delete-and-recreate: existing Package rows
  // may be referenced by past Orders (FK restrict), so we update them in
  // place and only insert new rows for tiers that didn't exist before.
  // Tiers omitted from the form are left untouched, not deleted.
  await db.$transaction([
    db.service.update({ where: { id: serviceId }, data: { title, description, categoryId } }),
    ...packages.map((p) =>
      db.package.upsert({
        where: { serviceId_tier: { serviceId, tier: p.tier } },
        create: {
          serviceId,
          tier: p.tier,
          title: p.title,
          description: p.description,
          priceCents: Math.round(p.priceRub * 100),
          deliveryDays: p.deliveryDays,
          revisions: p.revisions,
          features: p.features,
        },
        update: {
          title: p.title,
          description: p.description,
          priceCents: Math.round(p.priceRub * 100),
          deliveryDays: p.deliveryDays,
          revisions: p.revisions,
          features: p.features,
        },
      })
    ),
  ]);

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
  revalidatePath(`/services/${service.slug}`);

  return { ok: true };
}

export async function setServiceStatus(serviceId: string, status: "PUBLISHED" | "ARCHIVED"): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт" };

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service) return { ok: false, error: "Услуга не найдена" };
  if (service.sellerId !== user.id) return { ok: false, error: "Недостаточно прав" };

  await db.service.update({ where: { id: serviceId }, data: { status } });

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
  revalidatePath(`/services/${service.slug}`);

  return { ok: true };
}

export async function toggleFavorite(serviceId: string): Promise<ActionResult & { favorited?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите, чтобы добавлять в избранное" };

  const existing = await db.favorite.findUnique({
    where: { userId_serviceId: { userId: user.id, serviceId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard/favorites");
    return { ok: true, favorited: false };
  }

  await db.favorite.create({ data: { userId: user.id, serviceId } });
  revalidatePath("/dashboard/favorites");
  return { ok: true, favorited: true };
}
