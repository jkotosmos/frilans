import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
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
// nothing to load or wait on. Sets `data-telegram` on <html>, which the CSS
// in globals.css keys off to swap navbar/footer for the Mini App tab bar.
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
  viewportFit: "cover",
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* No CSP nonce here (see DEPLOYMENT.md): this is a static export with
            no server to generate one, and GitHub Pages can't set custom
            response headers anyway. The dynamic (Postgres-backed) version of
            this app in git history has the real nonce-based CSP. */}
        <Script id="telegram-detect" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: TELEGRAM_DETECT_SCRIPT }} />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
