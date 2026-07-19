import { db } from "@/lib/db";

export async function getServiceBySlug(slug: string) {
  const service = await db.service.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true, name: true, icon: true } },
      packages: { orderBy: { priceCents: "asc" } },
      seller: {
        select: {
          id: true,
          name: true,
          avatarSeed: true,
          title: true,
          isVerified: true,
          location: true,
          responseTime: true,
          memberSince: true,
          _count: { select: { services: true } },
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { author: { select: { name: true, avatarSeed: true } } },
      },
    },
  });
  if (!service || service.status !== "PUBLISHED") return null;
  return service;
}

export type ServiceDetail = NonNullable<Awaited<ReturnType<typeof getServiceBySlug>>>;
