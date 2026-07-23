"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelegram } from "./telegram-provider";

// Telegram's WebApp expects the app to drive its own native BackButton
// rather than relying on browser chrome, which Mini Apps don't have.
export function TelegramBackButton() {
  const { webApp } = useTelegram();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!webApp) return;

    const isRoot = pathname === "/" || pathname === "/dashboard";
    if (isRoot) {
      webApp.BackButton.hide();
      return;
    }

    const onClick = () => router.back();
    webApp.BackButton.show();
    webApp.BackButton.onClick(onClick);
    return () => {
      webApp.BackButton.offClick(onClick);
    };
  }, [webApp, pathname, router]);

  return null;
}
