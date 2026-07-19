import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Plus, Briefcase } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeneratedCover } from "@/components/ui/generated-cover";
import { ServiceRowActions } from "@/components/dashboard/service-row-actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Мои услуги" };

export default async function MyServicesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "FREELANCER") redirect("/dashboard");

  const services = await db.service.findMany({
    where: { sellerId: user.id },
    include: { category: true, packages: { orderBy: { priceCents: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Мои услуги</h1>
        <Link href="/dashboard/services/new">
          <Button size="sm">
            <Plus className="size-4" /> Новая услуга
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl2 border border-dashed border-ink-200 py-16 text-center">
          <Briefcase className="size-9 text-ink-300" />
          <p className="mt-3 text-sm text-ink-400">У вас пока нет опубликованных услуг</p>
          <Link href="/dashboard/services/new" className="mt-4">
            <Button size="sm">Создать первую услугу</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex gap-4 rounded-xl2 border border-ink-100 bg-cream-50 p-4 shadow-card">
              <div className="w-28 shrink-0 overflow-hidden rounded-lg">
                <GeneratedCover seed={service.coverSeed} icon={service.category.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/services/${service.slug}`} className="truncate font-medium text-ink-900 hover:text-rust-600">
                      {service.title}
                    </Link>
                    <p className="text-xs text-ink-400">{service.category.name}</p>
                  </div>
                  <Badge tone={service.status === "PUBLISHED" ? "success" : "neutral"}>
                    {service.status === "PUBLISHED" ? "Опубликована" : "Снята с публикации"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-ink-500">
                  от {formatPrice(Math.min(...service.packages.map((p) => p.priceCents)))} · {service.ordersCount} заказов ·{" "}
                  {service.ratingCount > 0 ? `★ ${service.rating.toFixed(1)}` : "нет отзывов"}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/dashboard/services/${service.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Редактировать
                    </Button>
                  </Link>
                  <ServiceRowActions serviceId={service.id} status={service.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
