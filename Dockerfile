# Multi-stage build for self-hosted deploys (Docker/Fly.io/Railway/a plain VPS
# via GitHub Actions). Vercel doesn't use this file at all — see DEPLOYMENT.md
# for that path, which is the simpler default if you don't need self-hosting.
#
# node:*-slim (Debian, glibc) is used throughout on purpose, not an Alpine
# image: Prisma's query engine binary is built for a specific OS/libc, and
# keeping build and runtime stages on the same base avoids the
# glibc/musl mismatch that's a common source of "works in build, breaks at
# runtime" Prisma+Docker issues.

FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# `COPY . .` pulls in everything NOT excluded by .dockerignore — which is
# exactly why .dockerignore lists .env there. Next.js's standalone output
# copies any .env file present at build time straight into
# .next/standalone/.env so the runtime image doesn't need it. That's
# convenient, but it also means a real .env sitting in the build context
# would get baked into the image as a real secret. If you ever change
# .dockerignore, keep that exclusion.
COPY . .
# Build-time-only placeholders: no page in this app queries the database at
# build time (every route is dynamically rendered — see README), so `prisma
# generate`/`next build` only need these to be *present*, not valid. Real
# values come from the runtime environment (docker run -e / your host's
# secrets), never from this image.
ENV DATABASE_URL="file:./build-placeholder.db"
ENV NEXTAUTH_SECRET="build-placeholder"
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Next's standalone output tracing doesn't always reliably pick up Prisma's
# generated client + query engine binary, so these are copied explicitly
# rather than trusted to tracing — a known rough edge in Next+Prisma+Docker
# setups. Harmless if standalone already included them; this just guarantees it.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=nextjs:nodejs /app/prisma/schema.prisma ./prisma/schema.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
