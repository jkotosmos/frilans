"use client";

import { createContext, useContext } from "react";
import { getDemoUser } from "@/lib/static-data";

/**
 * Stands in for next-auth's SessionProvider/useSession in the static build.
 * There's no real auth (see lib/session.ts), so rather than have every
 * client component sit in a permanent "loading" state fetching a
 * /api/auth/session that doesn't exist, this just hands out the same fixed
 * demo user the server side already renders with (lib/static-data.ts) —
 * keeps client and server-rendered HTML in agreement instead of the UI
 * flickering between "logged out" and demo content on every page load.
 */
const DemoSessionContext = createContext(getDemoUser());

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  return <DemoSessionContext.Provider value={getDemoUser()}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  return useContext(DemoSessionContext);
}
