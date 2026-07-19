import type { OrderStatus } from "@/lib/constants";

export type TransitionActor = "client" | "seller" | "either";

export const ORDER_TRANSITIONS: Record<OrderStatus, { next: OrderStatus; by: TransitionActor }[]> = {
  PENDING_PAYMENT: [
    { next: "IN_PROGRESS", by: "client" },
    { next: "CANCELLED", by: "either" },
  ],
  IN_PROGRESS: [
    { next: "DELIVERED", by: "seller" },
    { next: "CANCELLED", by: "either" },
    { next: "DISPUTED", by: "either" },
  ],
  DELIVERED: [
    { next: "COMPLETED", by: "client" },
    { next: "REVISION_REQUESTED", by: "client" },
    { next: "DISPUTED", by: "either" },
  ],
  REVISION_REQUESTED: [
    { next: "DELIVERED", by: "seller" },
    { next: "DISPUTED", by: "either" },
  ],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTED: [],
};
