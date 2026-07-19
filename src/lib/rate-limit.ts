/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * This is intentionally simple and lives in process memory, which is enough
 * for a single-instance deployment (or this demo). It does NOT share state
 * across multiple server instances/regions. Before scaling horizontally in
 * production, swap this for a shared store (e.g. Upstash Redis / @upstash/ratelimit)
 * behind the same `checkRateLimit` signature — every call site in this repo
 * only depends on the return shape below, not on how it's stored.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically drop stale buckets so this Map can't grow unbounded.
const MAX_BUCKETS = 50_000;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) buckets.clear();
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}
