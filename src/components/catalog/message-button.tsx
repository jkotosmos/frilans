"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startConversationWith } from "@/lib/actions/messages";

export function MessageButton({ recipientId, className }: { recipientId: string; className?: string }) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  async function onMessage() {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setLoading(true);
    const result = await startConversationWith(recipientId);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    router.push(`/dashboard/messages/${result.conversationId}`);
  }

  return (
    <Button onClick={onMessage} loading={loading} variant="outline" className={className}>
      <MessageCircle className="size-4" /> Написать сообщение
    </Button>
  );
}
