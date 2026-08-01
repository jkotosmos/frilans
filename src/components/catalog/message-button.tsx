"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoAction } from "@/lib/demo-actions";

export function MessageButton({ className }: { recipientId: string; className?: string }) {
  const [loading, setLoading] = useState(false);

  function onMessage() {
    setLoading(true);
    demoAction();
    setLoading(false);
  }

  return (
    <Button onClick={onMessage} loading={loading} variant="outline" className={className}>
      <MessageCircle className="size-4" /> Написать сообщение
    </Button>
  );
}
