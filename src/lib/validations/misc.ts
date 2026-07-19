import { z } from "zod";

export const messageSchema = z.object({
  conversationId: z.string().min(1).optional(),
  recipientId: z.string().min(1).optional(),
  body: z.string().trim().min(1, "Сообщение не может быть пустым").max(4000),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  skills: z.string().trim().max(300).optional().or(z.literal("")),
  responseTime: z.string().trim().max(60).optional().or(z.literal("")),
});
