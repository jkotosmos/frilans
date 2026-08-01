"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoAction } from "@/lib/demo-actions";
import type { OrderStatus } from "@/lib/constants";

interface Action {
  next: OrderStatus;
  label: string;
  variant?: "primary" | "outline" | "danger";
  confirm?: string;
}

export function OrderActions({ actions }: { orderId: string; actions: Action[] }) {
  const [pending, setPending] = useState<string | null>(null);

  function run(action: Action) {
    if (action.confirm && !window.confirm(action.confirm)) return;
    setPending(action.next);
    demoAction();
    setPending(null);
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
