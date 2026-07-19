import { db } from "@/lib/db";
import type { Role } from "@/lib/constants";

export async function getDashboardOverview(userId: string, role: Role) {
  const [asClientCount, asSellerCount, favoritesCount, activeAsClient, activeAsSeller, user] = await Promise.all([
    db.order.count({ where: { clientId: userId } }),
    role === "FREELANCER" ? db.order.count({ where: { sellerId: userId } }) : Promise.resolve(0),
    db.favorite.count({ where: { userId } }),
    db.order.count({ where: { clientId: userId, status: { in: ["PENDING_PAYMENT", "IN_PROGRESS", "DELIVERED", "REVISION_REQUESTED"] } } }),
    role === "FREELANCER"
      ? db.order.count({ where: { sellerId: userId, status: { in: ["IN_PROGRESS", "DELIVERED", "REVISION_REQUESTED"] } } })
      : Promise.resolve(0),
    db.user.findUnique({ where: { id: userId }, select: { balanceCents: true } }),
  ]);

  const recentOrders = await db.order.findMany({
    where: { OR: [{ clientId: userId }, { sellerId: userId }] },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      service: { select: { title: true, slug: true } },
      client: { select: { name: true } },
      seller: { select: { name: true } },
    },
  });

  return {
    asClientCount,
    asSellerCount,
    favoritesCount,
    activeAsClient,
    activeAsSeller,
    balanceCents: user?.balanceCents ?? 0,
    recentOrders,
  };
}
