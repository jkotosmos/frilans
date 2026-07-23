import crypto from "node:crypto";
import type { TelegramWebAppUser } from "@/types/telegram";

const MAX_INIT_DATA_AGE_SECONDS = 24 * 60 * 60; // reject stale/replayed initData

export interface ValidatedTelegramInitData {
  user: TelegramWebAppUser;
  authDate: number;
}

/**
 * Validates the `initData` string a Telegram Mini App hands the client on
 * launch, per Telegram's documented algorithm:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * This is the ONLY thing that actually proves a request came from Telegram
 * for a given bot — `initDataUnsafe` on the client is exactly that, unsafe,
 * and must never be trusted for authentication by itself. Everything here
 * runs server-side with the bot token as a secret HMAC key.
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string
): { ok: true; data: ValidatedTelegramInitData } | { ok: false; error: string } {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(initData);
  } catch {
    return { ok: false, error: "Некорректные данные Telegram" };
  }

  const hash = params.get("hash");
  if (!hash) return { ok: false, error: "Отсутствует подпись Telegram" };
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const hashBuffer = Buffer.from(hash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");
  if (hashBuffer.length !== computedBuffer.length || !crypto.timingSafeEqual(hashBuffer, computedBuffer)) {
    return { ok: false, error: "Подпись Telegram недействительна" };
  }

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Date.now() / 1000 - authDate > MAX_INIT_DATA_AGE_SECONDS) {
    return { ok: false, error: "Сессия Telegram устарела, откройте приложение заново" };
  }

  const userRaw = params.get("user");
  if (!userRaw) return { ok: false, error: "Нет данных пользователя Telegram" };

  let user: TelegramWebAppUser;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return { ok: false, error: "Некорректные данные пользователя Telegram" };
  }
  if (!user.id) return { ok: false, error: "Некорректные данные пользователя Telegram" };

  return { ok: true, data: { user, authDate } };
}
