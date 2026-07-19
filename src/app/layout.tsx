import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { headers } from "next/headers";
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

export const metadata: Metadata = {
  title: {
    default: "Артель — биржа фриланса",
    template: "%s — Артель",
  },
  description:
    "Артель — маркетплейс фриланс-услуг: находите проверенных исполнителей, заказывайте услуги и продавайте свою работу безопасно.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Reading headers() here opts every route into per-request dynamic
  // rendering, which the nonce-based CSP in middleware.ts requires: a nonce
  // is only meaningful if it's fresh on every response. Without this call,
  // pages with no other dynamic data would get statically prerendered once
  // at build time with a stale nonce baked in, and the browser would then
  // reject every script because it never matches the per-request CSP header.
  headers();
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
