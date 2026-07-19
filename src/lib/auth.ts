import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema, AUTH_GENERIC_ERROR } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const LOGIN_ATTEMPT_LIMIT = 10;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

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
