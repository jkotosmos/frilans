"use client";

import { useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useTelegram } from "./telegram-provider";

/**
 * Inside Telegram, there's no login form — the Mini App is expected to sign
 * the user in silently using the initData Telegram already handed it. This
 * renders nothing; it just fires signIn("telegram", ...) once when both
 * "we're in Telegram" and "no session yet" are true.
 */
export function TelegramAutoLogin() {
  const { isTelegram, webApp } = useTelegram();
  const { status } = useSession();
  const attempted = useRef(false);

  useEffect(() => {
    if (!isTelegram || !webApp || status !== "unauthenticated" || attempted.current) return;
    attempted.current = true;
    signIn("telegram", { initData: webApp.initData, redirect: false });
  }, [isTelegram, webApp, status]);

  return null;
}
