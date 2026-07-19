"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { PACKAGE_TIER_LABELS, PACKAGE_TIERS, type PackageTier } from "@/lib/constants";
import { createService, updateService } from "@/lib/actions/services";

interface PackageValues {
  title: string;
  description: string;
  priceRub: string;
  deliveryDays: string;
  revisions: string;
  features: string;
}

const emptyPackage: PackageValues = { title: "", description: "", priceRub: "", deliveryDays: "3", revisions: "1", features: "" };

interface ServiceFormProps {
  categories: { id: string; name: string }[];
  mode: "create" | "edit";
  serviceId?: string;
  initialValues?: {
    title: string;
    description: string;
    categoryId: string;
    packages: Partial<Record<PackageTier, PackageValues>>;
  };
}

export function ServiceForm({ categories, mode, serviceId, initialValues }: ServiceFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? categories[0]?.id ?? "");
  const [activeTiers, setActiveTiers] = useState<PackageTier[]>(
    initialValues ? (PACKAGE_TIERS.filter((t) => initialValues.packages[t]) as PackageTier[]) : ["BASIC"]
  );
  const [packages, setPackages] = useState<Record<PackageTier, PackageValues>>({
    BASIC: initialValues?.packages.BASIC ?? emptyPackage,
    STANDARD: initialValues?.packages.STANDARD ?? emptyPackage,
    PREMIUM: initialValues?.packages.PREMIUM ?? emptyPackage,
  });
  const [loading, setLoading] = useState(false);

  function setPackageField(tier: PackageTier, field: keyof PackageValues, value: string) {
    setPackages((prev) => ({ ...prev, [tier]: { ...prev[tier], [field]: value } }));
  }

  function addTier(tier: PackageTier) {
    setActiveTiers((prev) => [...prev, tier]);
  }
  function removeTier(tier: PackageTier) {
    setActiveTiers((prev) => prev.filter((t) => t !== tier));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("categoryId", categoryId);
    for (const tier of activeTiers) {
      const pkg = packages[tier];
      formData.set(`${tier}_title`, pkg.title);
      formData.set(`${tier}_description`, pkg.description);
      formData.set(`${tier}_price`, pkg.priceRub);
      formData.set(`${tier}_delivery`, pkg.deliveryDays);
      formData.set(`${tier}_revisions`, pkg.revisions);
      formData.set(`${tier}_features`, pkg.features);
    }

    const result = mode === "create" ? await createService(formData) : await updateService(serviceId!, formData);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(mode === "create" ? "Услуга опубликована" : "Изменения сохранены");
    router.push("/dashboard/services");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
        <h2 className="mb-4 font-medium text-ink-900">Основная информация</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Название услуги</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={10}
              maxLength={100}
              placeholder="Например: Разработаю сайт-визитку на Next.js"
            />
          </div>
          <div>
            <Label htmlFor="category">Категория</Label>
            <Select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={40}
              maxLength={4000}
              className="min-h-[140px]"
              placeholder="Расскажите, что входит в услугу, какой у вас опыт и как вы работаете с заказчиком"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
        <h2 className="mb-4 font-medium text-ink-900">Пакеты и цены</h2>
        <div className="space-y-6">
          {PACKAGE_TIERS.map((tier) => {
            if (!activeTiers.includes(tier)) return null;
            const pkg = packages[tier];
            return (
              <div key={tier} className="rounded-lg border border-ink-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-rust-600">{PACKAGE_TIER_LABELS[tier]}</h3>
                  {tier !== "BASIC" && (
                    <button type="button" onClick={() => removeTier(tier)} className="text-ink-300 hover:text-rust-600">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Название пакета</Label>
                    <Input value={pkg.title} onChange={(e) => setPackageField(tier, "title", e.target.value)} required maxLength={60} />
                  </div>
                  <div>
                    <Label>Цена, ₽</Label>
                    <Input
                      type="number"
                      min={500}
                      max={500000}
                      value={pkg.priceRub}
                      onChange={(e) => setPackageField(tier, "priceRub", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Срок, дней</Label>
                    <Input
                      type="number"
                      min={1}
                      max={180}
                      value={pkg.deliveryDays}
                      onChange={(e) => setPackageField(tier, "deliveryDays", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Правок</Label>
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      value={pkg.revisions}
                      onChange={(e) => setPackageField(tier, "revisions", e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Краткое описание пакета</Label>
                    <Input
                      value={pkg.description}
                      onChange={(e) => setPackageField(tier, "description", e.target.value)}
                      required
                      maxLength={300}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Что входит (через запятую)</Label>
                    <Input
                      value={pkg.features}
                      onChange={(e) => setPackageField(tier, "features", e.target.value)}
                      required
                      placeholder="3 варианта, 3 правки, исходные файлы"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-2">
            {PACKAGE_TIERS.filter((t) => !activeTiers.includes(t)).map((tier) => (
              <Button key={tier} type="button" variant="outline" size="sm" onClick={() => addTier(tier)}>
                <Plus className="size-4" /> Добавить «{PACKAGE_TIER_LABELS[tier]}»
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" loading={loading}>
        {mode === "create" ? "Опубликовать услугу" : "Сохранить изменения"}
      </Button>
    </form>
  );
}
