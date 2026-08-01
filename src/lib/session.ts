import { getDemoUser } from "@/lib/static-data";

// Static export build (see DEPLOYMENT.md): there's no server, so there's no
// real session to read. Every page renders as this fixed seeded freelancer
// instead — the point is to keep /dashboard genuinely visible (real-looking
// orders, services, messages) rather than a permanent redirect to a login
// form that can't actually authenticate anyone. The dynamic (Postgres +
// NextAuth) version of this function is in git history.
export async function getCurrentUser() {
  return getDemoUser();
}

export async function requireUser() {
  return getCurrentUser();
}
