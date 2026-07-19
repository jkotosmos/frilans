"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { messageSchema } from "@/lib/validations/misc";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/lib/actions/auth";

async function getOrCreateConversation(userAId: string, userBId: string) {
  const [participantAId, participantBId] = [userAId, userBId].sort() as [string, string];
  const existing = await db.conversation.findUnique({
    where: { participantAId_participantBId: { participantAId, participantBId } },
  });
  if (existing) return existing;
  return db.conversation.create({ data: { participantAId, participantBId } });
}

export async function startConversationWith(recipientId: string): Promise<ActionResult & { conversationId?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите, чтобы написать сообщение" };
  if (recipientId === user.id) return { ok: false, error: "Нельзя написать самому себе" };

  const recipient = await db.user.findUnique({ where: { id: recipientId } });
  if (!recipient) return { ok: false, error: "Пользователь не найден" };

  const conversation = await getOrCreateConversation(user.id, recipientId);
  return { ok: true, conversationId: conversation.id };
}

export async function sendMessage(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт" };

  const rl = checkRateLimit(`message:${user.id}`, 30, 60 * 1000);
  if (!rl.success) return { ok: false, error: "Слишком много сообщений подряд. Подождите немного." };

  const parsed = messageSchema.safeParse({
    conversationId: formData.get("conversationId") || undefined,
    recipientId: formData.get("recipientId") || undefined,
    body: formData.get("body"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте сообщение" };

  let conversationId = parsed.data.conversationId;

  if (!conversationId && parsed.data.recipientId) {
    const conversation = await getOrCreateConversation(user.id, parsed.data.recipientId);
    conversationId = conversation.id;
  }
  if (!conversationId) return { ok: false, error: "Не удалось определить диалог" };

  const conversation = await db.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return { ok: false, error: "Диалог не найден" };
  if (conversation.participantAId !== user.id && conversation.participantBId !== user.id) {
    return { ok: false, error: "Недостаточно прав" };
  }

  await db.message.create({
    data: { conversationId, authorId: user.id, body: parsed.data.body },
  });
  await db.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

  revalidatePath(`/dashboard/messages/${conversationId}`);
  revalidatePath("/dashboard/messages");
  return { ok: true };
}
