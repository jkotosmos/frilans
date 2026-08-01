// Static export build — reads src/data/seed-data.json instead of Prisma.
// See src/lib/static-data.ts and DEPLOYMENT.md.
export { getFreelancerById } from "@/lib/static-data";
export type { FreelancerDetail } from "@/lib/static-data";
