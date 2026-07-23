"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { TelegramWebApp, TelegramWebAppUser } from "@/types/telegram";

interface TelegramContextValue {
  isTelegram: boolean;
  webApp: TelegramWebApp | null;
  user: TelegramWebAppUser | null;
  startParam: string | null;
}

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  webApp: null,
  user: null,
  startParam: null,
});

export function useTelegram() {
  return useContext(TelegramContext);
}

// Matches the app's `cream-100` background so there's no color seam between
// Telegram's own chrome (status bar area, pull-to-close background) and the
// page underneath.
const BRAND_BACKGROUND = "#faf6ef";

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<TelegramContextValue>({
    isTelegram: false,
    webApp: null,
    user: null,
    startParam: null,
  });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    // No Telegram object (or an initData-less browser tab hitting the same
    // URL) — this is a plain website visit, not a Mini App session. Every
    // Telegram-specific affordance stays off, and the rest of the app
    // behaves exactly like it does on the open web.
    if (!tg || !tg.initData) return;

    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor(BRAND_BACKGROUND);
      tg.setBackgroundColor(BRAND_BACKGROUND);
    } catch {
      // Older Telegram clients don't support these calls — safe to ignore.
    }

    setValue({
      isTelegram: true,
      webApp: tg,
      user: tg.initDataUnsafe.user ?? null,
      startParam: tg.initDataUnsafe.start_param ?? null,
    });
  }, []);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}
