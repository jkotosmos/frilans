"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoAction } from "@/lib/demo-actions";

export function ServiceRowActions({ status }: { serviceId: string; status: string }) {
  const [loading, setLoading] = useState(false);

  function toggle() {
    setLoading(true);
    demoAction();
    setLoading(false);
  }

  return (
    <Button variant="outline" size="sm" loading={loading} onClick={toggle}>
      {status === "PUBLISHED" ? "Снять с публикации" : "Опубликовать"}
    </Button>
  );
}
