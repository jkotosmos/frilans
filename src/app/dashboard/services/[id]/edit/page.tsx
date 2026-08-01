import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getCategories } from "@/lib/queries/categories";
import { getServiceForEdit, getAllServiceIds } from "@/lib/static-data";
import { ServiceForm } from "@/components/dashboard/service-form";
import type { PackageTier } from "@/lib/constants";

export const metadata: Metadata = { title: "Редактирование услуги" };

export async function generateStaticParams() {
  const ids = await getAllServiceIds();
  return ids.map((id) => ({ id }));
}

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "FREELANCER") redirect("/dashboard");

  const [service, categories] = await Promise.all([getServiceForEdit(params.id), getCategories()]);

  if (!service) notFound();
  if (service.sellerId !== user.id) notFound();

  const packages: Record<string, { title: string; description: string; priceRub: string; deliveryDays: string; revisions: string; features: string }> = {};
  for (const pkg of service.packages) {
    packages[pkg.tier] = {
      title: pkg.title,
      description: pkg.description,
      priceRub: String(pkg.priceCents / 100),
      deliveryDays: String(pkg.deliveryDays),
      revisions: String(pkg.revisions),
      features: pkg.features,
    };
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Редактирование услуги</h1>
      <div className="mt-6">
        <ServiceForm
          categories={categories}
          mode="edit"
          serviceId={service.id}
          initialValues={{
            title: service.title,
            description: service.description,
            categoryId: service.categoryId,
            packages: packages as Partial<Record<PackageTier, (typeof packages)[string]>>,
          }}
        />
      </div>
    </div>
  );
}
