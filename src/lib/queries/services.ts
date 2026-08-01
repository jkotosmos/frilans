// Static export build — reads src/data/seed-data.json instead of Prisma.
// See src/lib/static-data.ts and DEPLOYMENT.md.
export { getFeaturedServices, getFilteredServices, getAllServiceSlugs } from "@/lib/static-data";
export type { ServiceFilters } from "@/lib/static-data";
