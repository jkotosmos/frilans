import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { loginSchema, AUTH_GENERIC_ERROR } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateTelegramInitData } from "@/lib/telegram-auth";
import { hashSeed } from "@/lib/utils";

const LOGIN_ATTEMPT_LIMIT = 10;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const TELEGRAM_LOGIN_LIMIT = 20;
const TELEGRAM_LOGIN_WINDOW_MS = 10 * 60 * 1000;

function clientIpFrom(req: { headers?: Record<string, string> } | undefined) {
  const forwarded = req?.headers?.["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return "unknown";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(raw, req) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) throw new Error(AUTH_GENERIC_ERROR);
        const { email, password } = parsed.data;

        // Rate-limit by IP *and* by target email so an attacker can't brute
        // force a single account from many IPs, nor spray many accounts from one.
        const ip = clientIpFrom(req as unknown as { headers?: Record<string, string> });
        const ipCheck = checkRateLimit(`login:ip:${ip}`, LOGIN_ATTEMPT_LIMIT, LOGIN_WINDOW_MS);
        const emailCheck = checkRateLimit(`login:email:${email}`, LOGIN_ATTEMPT_LIMIT, LOGIN_WINDOW_MS);
        if (!ipCheck.success || !emailCheck.success) {
          throw new Error("Слишком много попыток входа. Попробуйте позже.");
        }

        const user = await db.user.findUnique({ where: { email } });
        if (!user) throw new Error(AUTH_GENERIC_ERROR);

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error(AUTH_GENERIC_ERROR);

        return { id: user.id, name: user.name, email: user.email, role: user.role as "CLIENT" | "FREELANCER" | "ADMIN" };
      },
    }),
    // Powers the Telegram Mini App auto-login (TelegramAutoLogin component):
    // the client hands us the raw, Telegram-signed `initData` string, and
    // this never trusts anything about *who* the user is until the HMAC
    // signature is verified server-side against TELEGRAM_BOT_TOKEN.
    CredentialsProvider({
      id: "telegram",
      name: "Telegram",
      credentials: { initData: { label: "Telegram initData", type: "text" } },
      async authorize(raw, req) {
        const initData = typeof raw?.initData === "string" ? raw.initData : "";
        if (!initData) throw new Error("Отсутствуют данные Telegram");

        const ip = clientIpFrom(req as unknown as { headers?: Record<string, string> });
        const rl = checkRateLimit(`login:telegram:${ip}`, TELEGRAM_LOGIN_LIMIT, TELEGRAM_LOGIN_WINDOW_MS);
        if (!rl.success) throw new Error("Слишком много попыток входа. Попробуйте позже.");

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          // Not configured — fail closed rather than silently trusting the
          // client. See TELEGRAM.md for how to obtain this from BotFather.
          throw new Error("Вход через Telegram временно недоступен");
        }

        const validated = validateTelegramInitData(initData, botToken);
        if (!validated.ok) throw new Error(validated.error);

        const { user: tgUser } = validated.data;
        const telegramId = String(tgUser.id);

        let user = await db.user.findUnique({ where: { telegramId } });
        if (!user) {
          const name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") || `Пользователь Telegram`;
          // Telegram accounts don't set a password — generate one that's
          // random, hashed, and never revealed, so the row satisfies the
          // schema's NOT NULL passwordHash without being a usable credential.
          const unusablePassword = crypto.randomBytes(32).toString("hex");
          user = await db.user.create({
            data: {
              name,
              email: `tg-${telegramId}@telegram.artel.local`,
              passwordHash: await bcrypt.hash(unusablePassword, 12),
              telegramId,
              role: "CLIENT",
              avatarSeed: hashSeed(`telegram-${telegramId}`).toString(36),
            },
          });
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role as "CLIENT" | "FREELANCER" | "ADMIN" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as "CLIENT" | "FREELANCER" | "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
