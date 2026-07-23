"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "./telegram-provider";

/**
 * Resolves the `startapp` parameter from links like
 * `https://t.me/YourBot/app?startapp=svc-nekiy-slug`, which Telegram exposes
 * to the Mini App as `initDataUnsafe.start_param`. Lets a bot message or
 * inline button drop a user straight onto a specific service or freelancer
 * profile instead of the home screen.
 *
 * Telegram restricts start_param to [A-Za-z0-9_-], so it can't carry a slug
 * with special characters directly — the `svc-`/`fl-` prefix convention
 * below is deliberately simple to keep every valid slug this app generates
 * representable.
 */
export function TelegramDeepLink() {
  const { startParam } = useTelegram();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (!startParam || handled.current) return;
    handled.current = true;

    if (startParam.startsWith("svc-")) {
      router.replace(`/services/${startParam.slice(4)}`);
    } else if (startParam.startsWith("fl-")) {
      router.replace(`/freelancers/${startParam.slice(3)}`);
    }
  }, [startParam, router]);

  return null;
}
