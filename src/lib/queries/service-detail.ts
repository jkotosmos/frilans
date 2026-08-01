// Static export build — reads src/data/seed-data.json instead of Prisma.
// See src/lib/static-data.ts and DEPLOYMENT.md.
export { getServiceBySlug } from "@/lib/static-data";
export type { ServiceDetail } from "@/lib/static-data";
