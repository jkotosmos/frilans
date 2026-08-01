"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { ServiceCard, type ServiceCardData } from "@/components/catalog/service-card";
import { demoAction } from "@/lib/demo-actions";

export function FavoriteCard({ service }: { service: ServiceCardData; serviceId: string }) {
  const [removing, setRemoving] = useState(false);

  function onRemove() {
    setRemoving(true);
    demoAction();
    setRemoving(false);
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
