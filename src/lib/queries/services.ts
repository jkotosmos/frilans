import { db } from "@/lib/db";
import type { ServiceCardData } from "@/components/catalog/service-card";

export const serviceCardInclude = {
  category: { select: { slug: true, name: true, icon: true } },
  seller: { select: { id: true, name: true, avatarSeed: true, isVerified: true } },
  packages: { select: { priceCents: true } },
} as const;

type ServiceWithRelations = {
  slug: string;
  title: string;
  coverSeed: string;
  rating: number;
  ratingCount: number;
  ordersCount: number;
  category: { slug: string; name: string; icon: string };
  seller: { id: string; name: string; avatarSeed: string; isVerified: boolean };
  packages: { priceCents: number }[];
};

export function toServiceCardData(service: ServiceWithRelations): ServiceCardData {
  const startingPriceCents = Math.min(...service.packages.map((p) => p.priceCents));
  return {
    slug: service.slug,
    title: service.title,
    coverSeed: service.coverSeed,
    rating: service.rating,
    ratingCount: service.ratingCount,
    ordersCount: service.ordersCount,
    category: service.category,
    seller: service.seller,
    startingPriceCents,
  };
}

export async function getFeaturedServices(limit = 8) {
  const services = await db.service.findMany({
    where: { status: "PUBLISHED" },
    include: serviceCardInclude,
    orderBy: [{ ordersCount: "desc" }, { rating: "desc" }],
    take: limit,
  });
  return services.map(toServiceCardData);
}

export interface ServiceFilters {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "rating" | "price_asc" | "price_desc" | "new";
  page?: number;
}

const PAGE_SIZE = 12;

export async function getFilteredServices(filters: ServiceFilters) {
  const services = await db.service.findMany({
    where: {
      status: "PUBLISHED",
      ...(filters.category ? { category: { slug: filters.category } } : {}),
    },
    include: serviceCardInclude,
    orderBy: filters.sort === "new" ? { createdAt: "desc" } : filters.sort === "rating" ? { rating: "desc" } : { ordersCount: "desc" },
  });

  let cards = services.map(toServiceCardData);

  // SQLite's LIKE (what Prisma's `contains` compiles to) is case-sensitive
  // for non-ASCII text, so Cyrillic search is filtered here in JS instead —
  // fine at this dataset size; a Postgres deployment could push this back
  // into the query with `mode: "insensitive"`.
  if (filters.q) {
    const needle = filters.q.toLocaleLowerCase("ru");
    cards = cards.filter((c) => c.title.toLocaleLowerCase("ru").includes(needle));
  }

  if (filters.minPrice !== undefined) {
    cards = cards.filter((c) => c.startingPriceCents >= filters.minPrice! * 100);
  }
  if (filters.maxPrice !== undefined) {
    cards = cards.filter((c) => c.startingPriceCents <= filters.maxPrice! * 100);
  }
  if (filters.sort === "price_asc") cards = [...cards].sort((a, b) => a.startingPriceCents - b.startingPriceCents);
  if (filters.sort === "price_desc") cards = [...cards].sort((a, b) => b.startingPriceCents - a.startingPriceCents);

  const page = filters.page ?? 1;
  const total = cards.length;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = cards.slice(start, start + PAGE_SIZE);

  return { items: pageItems, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
