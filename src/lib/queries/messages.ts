import { db } from "@/lib/db";

export async function getConversationsForUser(userId: string) {
  const conversations = await db.conversation.findMany({
    where: { OR: [{ participantAId: userId }, { participantBId: userId }] },
    orderBy: { updatedAt: "desc" },
    include: {
      participantA: { select: { id: true, name: true, avatarSeed: true, role: true } },
      participantB: { select: { id: true, name: true, avatarSeed: true, role: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: { messages: { where: { readAt: null, NOT: { authorId: userId } } } },
      },
    },
  });

  return conversations.map((c) => ({
    id: c.id,
    other: c.participantAId === userId ? c.participantB : c.participantA,
    lastMessage: c.messages[0] ?? null,
    unreadCount: c._count.messages,
    updatedAt: c.updatedAt,
  }));
}

export async function getConversationThread(conversationId: string, userId: string) {
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participantA: { select: { id: true, name: true, avatarSeed: true, role: true } },
      participantB: { select: { id: true, name: true, avatarSeed: true, role: true } },
      messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { id: true, name: true, avatarSeed: true } } } },
    },
  });

  if (!conversation) return null;
  if (conversation.participantAId !== userId && conversation.participantBId !== userId) return null;

  const other = conversation.participantAId === userId ? conversation.participantB : conversation.participantA;

  await db.message.updateMany({
    where: { conversationId, NOT: { authorId: userId }, readAt: null },
    data: { readAt: new Date() },
  });

  return { id: conversation.id, other, messages: conversation.messages };
}
