"use client";

import { Toaster } from "sonner";
import { DemoSessionProvider } from "@/components/demo/demo-session";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { TelegramBackButton } from "@/components/telegram/telegram-back-button";
import { TelegramDeepLink } from "@/components/telegram/telegram-deep-link";
import { MiniAppTabBar } from "@/components/telegram/mini-app-tab-bar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <TelegramProvider>
        <TelegramBackButton />
        <TelegramDeepLink />
        {children}
        <MiniAppTabBar />
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
      </TelegramProvider>
    </DemoSessionProvider>
  );
}
