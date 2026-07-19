"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { ServiceCard, type ServiceCardData } from "@/components/catalog/service-card";
import { toggleFavorite } from "@/lib/actions/services";

export function FavoriteCard({ service, serviceId }: { service: ServiceCardData; serviceId: string }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  async function onRemove() {
    setRemoving(true);
    const result = await toggleFavorite(serviceId);
    setRemoving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Удалено из избранного");
    router.refresh();
  }

  return (
    <div className="relative">
      <ServiceCard service={service} />
      <button
        onClick={onRemove}
        disabled={removing}
        aria-label="Убрать из избранного"
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-cream-50/95 text-rust-500 shadow-card transition-transform hover:scale-105 disabled:opacity-50"
      >
        <Heart className="size-4 fill-rust-500" />
      </button>
    </div>
  );
}
