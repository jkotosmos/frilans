import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const display = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

// Runs before hydration, before the Telegram SDK script, and — deliberately —
// without depending on it: Telegram launches a Mini App by appending its init
// payload to the URL itself (`#tgWebAppData=...`), so this can detect "are we
// inside Telegram" straight from `location.hash`/`location.search`, with
// nothing to load or wait on. That buys two things: it stays correct even if
// the SDK script itself is slow, blocked, or fails to load for any reason,
// and it sets `data-telegram` on <html> — which the CSS in globals.css keys
// off to swap navbar/footer for the Mini App tab bar — well before hydration
// finishes, rather than waiting on a client component's useEffect.
//
// Measured, not assumed: despite the "beforeInteractive" name, Next.js
// doesn't run this as a literal parser-blocking <script> before first paint —
// it queues it and processes the queue once its own runtime chunk has
// loaded, which measured ~50ms after DOMContentLoaded in a production build
// here. That's a real, if brief, window where the desktop chrome could paint
// first; it's the earliest hook the App Router gives you short of a custom
// server, and 50ms is below what's perceptible as a "flash" for most users,
// but it is not a hard synchronous guarantee — don't rely on this for
// anything security-sensitive, only for UI chrome selection.
const TELEGRAM_DETECT_SCRIPT = `
(function () {
  try {
    if (/tgWebAppData/.test(location.hash) || /tgWebAppData/.test(location.search)) {
      document.documentElement.setAttribute('data-telegram', '1');
    }
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: {
    default: "Артель — биржа фриланса",
    template: "%s — Артель",
  },
  description:
    "Артель — маркетплейс фриланс-услуг: находите проверенных исполнителей, заказывайте услуги и продавайте свою работу безопасно.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the page draw under the status bar / home indicator instead of
  // leaving a hard color seam — matters both for iOS PWA-style browsing and
  // for the Telegram Mini App WebView, which has no chrome of its own there.
  viewportFit: "cover",
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Reading headers() here opts every route into per-request dynamic
  // rendering, which the nonce-based CSP in middleware.ts requires: a nonce
  // is only meaningful if it's fresh on every response. Without this call,
  // pages with no other dynamic data would get statically prerendered once
  // at build time with a stale nonce baked in, and the browser would then
  // reject every script because it never matches the per-request CSP header.
  const nonce = headers().get("x-nonce") ?? undefined;
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Ordered before the SDK script on purpose — see the comment on
            TELEGRAM_DETECT_SCRIPT above for why it doesn't need to wait on it. */}
        <Script id="telegram-detect" strategy="beforeInteractive" nonce={nonce} dangerouslySetInnerHTML={{ __html: TELEGRAM_DETECT_SCRIPT }} />
        {/* Telegram Mini Apps need this loaded before the app can call
            window.Telegram.WebApp — see TelegramProvider. Outside Telegram
            this script loads, does nothing harmful, and window.Telegram
            simply never gets used. */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" nonce={nonce} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
