import { db } from "@/lib/db";
import type { FreelancerCardData } from "@/components/catalog/freelancer-card";

export async function getTopFreelancers(limit = 4): Promise<FreelancerCardData[]> {
  const [freelancers, ratingGroups] = await Promise.all([
    db.user.findMany({
      where: { role: "FREELANCER" },
      include: { _count: { select: { services: true, reviewsReceived: true } } },
    }),
    db.review.groupBy({ by: ["targetId"], _avg: { rating: true } }),
  ]);

  const avgById = new Map(ratingGroups.map((g) => [g.targetId, g._avg.rating ?? 0]));

  const withRatings = freelancers.map((f) => ({
    id: f.id,
    name: f.name,
    avatarSeed: f.avatarSeed,
    title: f.title,
    location: f.location,
    isVerified: f.isVerified,
    skills: f.skills,
    avgRating: avgById.get(f.id) ?? 0,
    reviewCount: f._count.reviewsReceived,
    servicesCount: f._count.services,
  }));

  return withRatings
    .sort((a, b) => b.avgRating * b.reviewCount - a.avgRating * a.reviewCount || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export async function getAllFreelancers(): Promise<FreelancerCardData[]> {
  return getTopFreelancers(Number.MAX_SAFE_INTEGER);
}
