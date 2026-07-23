import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit } from "@/lib/rate-limit";

const PROTECTED_PREFIXES = ["/dashboard"];

// Telegram Web (the browser client, web.telegram.org / k.telegram.org) opens
// Mini Apps inside an <iframe>. Native Telegram apps (iOS/Android/Desktop)
// render the page in a plain WebView, not a same-origin-checked iframe, so
// they're unaffected by frame-ancestors either way — this allowlist only
// matters for the web client.
const TELEGRAM_FRAME_ANCESTORS = "https://web.telegram.org https://webk.telegram.org https://webz.telegram.org";

function buildCsp(nonce: string) {
  // Next.js dev mode compiles client bundles with `eval()`-based source maps
  // (webpack's "eval-source-map" devtool) — without 'unsafe-eval' the whole
  // client bundle throws and the app never hydrates in `next dev`. Production
  // builds don't use eval, so the stricter policy applies there.
  const isDev = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    // 'strict-dynamic' means any script loaded by a nonce'd <script> tag
    // (like the Telegram Web App SDK loaded via next/script with our nonce)
    // is trusted too, without needing to allowlist telegram.org by host.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'", // Tailwind/Next inject style tags without nonces today
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    `frame-ancestors 'self' ${TELEGRAM_FRAME_ANCESTORS}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.ip ?? "unknown";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Coarse-grained defense-in-depth limiter on the auth callback endpoint,
  // on top of the finer-grained per-email/per-IP checks inside authorize().
  if (pathname.startsWith("/api/auth/callback/credentials")) {
    const rl = checkRateLimit(`mw:auth:${clientIp(req)}`, 20, 5 * 60 * 1000);
    if (!rl.success) {
      return new NextResponse("Слишком много запросов, попробуйте позже.", { status: 429 });
    }
  }

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const nonce = crypto.randomUUID().replace(/-/g, "");
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  // No X-Frame-Options here on purpose: it can't express "allow these specific
  // origins," only all-or-nothing, and would fight the frame-ancestors
  // allowlist above. Modern browsers use frame-ancestors when both are
  // present, but shipping a header that contradicts the active policy is
  // just confusing for the next person reading this file.
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  return response;
}

export const config = {
  matcher: [
    // Skip static assets; run on everything else (pages + API routes).
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
