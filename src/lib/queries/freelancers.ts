// Static export build — reads src/data/seed-data.json instead of Prisma.
// See src/lib/static-data.ts and DEPLOYMENT.md.
export { getTopFreelancers, getAllFreelancers, getAllFreelancerIds } from "@/lib/static-data";
