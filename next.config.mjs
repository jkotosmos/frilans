/** @type {import('next').NextConfig} */
// Baseline headers as defense-in-depth for responses middleware doesn't touch
// (e.g. static files under /public). Per-request pages get a stricter,
// nonce-based Content-Security-Policy from middleware.ts.
//
// No X-Frame-Options here: this app is embeddable as a Telegram Mini App,
// which Telegram Web renders in an <iframe>. middleware.ts's
// Content-Security-Policy `frame-ancestors` directive is the actual, precise
// control (it can allowlist specific origins; X-Frame-Options can't), so
// this file only carries the headers that don't conflict with that.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Only affects `docker build` (see Dockerfile) — produces a minimal
  // self-contained server in .next/standalone instead of requiring the full
  // node_modules tree at runtime. Vercel ignores this and doesn't need it;
  // it's here for self-hosted/Docker deploys. See DEPLOYMENT.md.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
