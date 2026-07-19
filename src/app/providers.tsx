"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#191510",
            color: "#FAF6EF",
            border: "1px solid #332E27",
          },
        }}
      />
    </SessionProvider>
  );
}
