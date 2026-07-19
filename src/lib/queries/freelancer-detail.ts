import { db } from "@/lib/db";
import { toServiceCardData, serviceCardInclude } from "@/lib/queries/services";

export async function getFreelancerById(id: string) {
  const freelancer = await db.user.findUnique({
    where: { id, role: "FREELANCER" },
    include: {
      portfolioItems: { orderBy: { createdAt: "desc" }, take: 6 },
      services: {
        where: { status: "PUBLISHED" },
        include: serviceCardInclude,
        orderBy: { ordersCount: "desc" },
      },
      reviewsReceived: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { author: { select: { name: true, avatarSeed: true } } },
      },
      _count: { select: { reviewsReceived: true } },
    },
  });
  if (!freelancer) return null;

  const ratingAgg = await db.review.aggregate({ where: { targetId: id }, _avg: { rating: true } });

  return {
    ...freelancer,
    services: freelancer.services.map(toServiceCardData),
    avgRating: ratingAgg._avg.rating ?? 0,
  };
}

export type FreelancerDetail = NonNullable<Awaited<ReturnType<typeof getFreelancerById>>>;
