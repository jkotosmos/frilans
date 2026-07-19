import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getCategories } from "@/lib/queries/categories";
import { ServiceForm } from "@/components/dashboard/service-form";

export const metadata: Metadata = { title: "Новая услуга" };

export default async function NewServicePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "FREELANCER") redirect("/dashboard");

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Новая услуга</h1>
      <p className="mt-1 text-ink-500">Заполните карточку услуги — она сразу станет видна в каталоге</p>
      <div className="mt-6">
        <ServiceForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
