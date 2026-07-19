"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setServiceStatus } from "@/lib/actions/services";

export function ServiceRowActions({ serviceId, status }: { serviceId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    const result = await setServiceStatus(serviceId, next);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" loading={loading} onClick={toggle}>
      {status === "PUBLISHED" ? "Снять с публикации" : "Опубликовать"}
    </Button>
  );
}
