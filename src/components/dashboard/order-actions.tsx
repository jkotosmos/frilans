"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { transitionOrder } from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/constants";

interface Action {
  next: OrderStatus;
  label: string;
  variant?: "primary" | "outline" | "danger";
  confirm?: string;
}

export function OrderActions({ orderId, actions }: { orderId: string; actions: Action[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function run(action: Action) {
    if (action.confirm && !window.confirm(action.confirm)) return;
    setPending(action.next);
    const result = await transitionOrder(orderId, action.next);
    setPending(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Статус заказа обновлён");
    router.refresh();
  }

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.next}
          variant={action.variant ?? "primary"}
          size="sm"
          loading={pending === action.next}
          disabled={pending !== null && pending !== action.next}
          onClick={() => run(action)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
