"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashSeed } from "@/lib/utils";

const REGISTER_LIMIT = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000; // 1 hour per IP

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function registerUser(formData: FormData): Promise<ActionResult> {
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = checkRateLimit(`register:ip:${ip}`, REGISTER_LIMIT, REGISTER_WINDOW_MS);
  if (!rl.success) {
    return { ok: false, error: "Слишком много попыток регистрации. Попробуйте позже." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "CLIENT",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте введённые данные" };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // Same generic phrasing as login errors — don't confirm which emails exist.
    return { ok: false, error: "Не удалось создать аккаунт с этими данными" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      avatarSeed: hashSeed(email).toString(36),
    },
  });

  return { ok: true };
}
