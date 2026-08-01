// Static export build — reads src/data/seed-data.json instead of Prisma.
// See src/lib/static-data.ts and DEPLOYMENT.md.
export { getConversationsForUser, getConversationThread, getAllConversationIds } from "@/lib/static-data";
