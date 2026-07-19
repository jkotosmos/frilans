export const ROLES = ["CLIENT", "FREELANCER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const SERVICE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const PACKAGE_TIERS = ["BASIC", "STANDARD", "PREMIUM"] as const;
export type PackageTier = (typeof PACKAGE_TIERS)[number];

export const PACKAGE_TIER_LABELS: Record<PackageTier, string> = {
  BASIC: "Базовый",
  STANDARD: "Стандарт",
  PREMIUM: "Премиум",
};

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "IN_PROGRESS",
  "DELIVERED",
  "REVISION_REQUESTED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Ожидает оплаты",
  IN_PROGRESS: "В работе",
  DELIVERED: "Сдан на проверку",
  REVISION_REQUESTED: "На доработке",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён",
  DISPUTED: "Спор",
};

export const ORDER_STATUS_TONES: Record<OrderStatus, "neutral" | "info" | "success" | "warning" | "danger"> = {
  PENDING_PAYMENT: "warning",
  IN_PROGRESS: "info",
  DELIVERED: "info",
  REVISION_REQUESTED: "warning",
  COMPLETED: "success",
  CANCELLED: "neutral",
  DISPUTED: "danger",
};

/** Categories are seeded into the DB, this is the editorial source of truth
 *  for icon + copy so the seed script and any admin tooling agree. */
export const CATEGORY_DEFS = [
  {
    slug: "web-razrabotka",
    name: "Веб-разработка",
    description: "Сайты, интернет-магазины, веб-приложения, лендинги",
    icon: "Code2",
  },
  {
    slug: "dizajn-i-grafika",
    name: "Дизайн и графика",
    description: "Логотипы, фирменный стиль, UI/UX, иллюстрации",
    icon: "PenTool",
  },
  {
    slug: "mobilnaya-razrabotka",
    name: "Мобильная разработка",
    description: "Приложения для iOS, Android, кроссплатформенные решения",
    icon: "Smartphone",
  },
  {
    slug: "tekst-i-perevod",
    name: "Тексты и переводы",
    description: "Копирайтинг, редактура, SEO-тексты, переводы",
    icon: "PenLine",
  },
  {
    slug: "marketing",
    name: "Маркетинг и реклама",
    description: "Таргет, контекст, SMM, стратегии продвижения",
    icon: "Megaphone",
  },
  {
    slug: "video-i-animatsiya",
    name: "Видео и анимация",
    description: "Монтаж, моушн-дизайн, 2D/3D анимация",
    icon: "Clapperboard",
  },
  {
    slug: "audio-i-muzyka",
    name: "Аудио и музыка",
    description: "Озвучка, саунд-дизайн, музыка на заказ",
    icon: "AudioLines",
  },
  {
    slug: "biznes-i-analitika",
    name: "Бизнес и аналитика",
    description: "Консалтинг, финмодели, аналитика данных",
    icon: "LineChart",
  },
] as const;

export const MIN_PRICE_RUB = 500;
export const MAX_PRICE_RUB = 500_000;

export const PLATFORM_FEE_PERCENT = 10;
