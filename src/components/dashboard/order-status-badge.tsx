import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES, type OrderStatus } from "@/lib/constants";

export function OrderStatusBadge({ status }: { status: string }) {
  const s = status as OrderStatus;
  return <Badge tone={ORDER_STATUS_TONES[s] ?? "neutral"}>{ORDER_STATUS_LABELS[s] ?? status}</Badge>;
}
