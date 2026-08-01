/**
 * One-off export: dumps the current database into src/data/*.json for the
 * static (GitHub Pages) build — see static-data.ts, which is what actually
 * reads these files at build time. Not part of the normal dev/prod flow;
 * re-run manually if you reseed and want the static demo to reflect it:
 *
 *   npx tsx scripts/export-static-data.ts
 */
import { writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const [categories, users, services, packages, portfolioItems, reviews, orders, conversations, messages, favorites] =
    await Promise.all([
      db.category.findMany({ orderBy: { order: "asc" } }),
      db.user.findMany(),
      db.service.findMany(),
      db.package.findMany(),
      db.portfolioItem.findMany(),
      db.review.findMany(),
      db.order.findMany(),
      db.conversation.findMany(),
      db.message.findMany(),
      db.favorite.findMany(),
    ]);

  // Never export passwordHash — this JSON ships in the public static bundle.
  const safeUsers = users.map(({ passwordHash: _passwordHash, ...rest }) => rest);

  const dataset = {
    categories,
    users: safeUsers,
    services,
    packages,
    portfolioItems,
    reviews,
    orders,
    conversations,
    messages,
    favorites,
  };

  writeFileSync(new URL("../src/data/seed-data.json", import.meta.url), JSON.stringify(dataset, null, 2) + "\n");

  console.log(
    `Exported: ${categories.length} categories, ${safeUsers.length} users, ${services.length} services, ` +
      `${packages.length} packages, ${reviews.length} reviews, ${orders.length} orders, ` +
      `${conversations.length} conversations, ${messages.length} messages, ${favorites.length} favorites.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
