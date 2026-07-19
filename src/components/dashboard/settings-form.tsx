"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/profile";

interface SettingsFormProps {
  initial: {
    name: string;
    title: string;
    bio: string;
    location: string;
    skills: string;
    responseTime: string;
  };
  isFreelancer: boolean;
}

export function SettingsForm({ initial, isFreelancer }: SettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) formData.set(key, value);
    const result = await updateProfile(formData);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Профиль обновлён");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl2 border border-ink-100 bg-cream-50 p-6 shadow-card">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input id="name" value={values.name} onChange={(e) => set("name", e.target.value)} required minLength={2} maxLength={60} />
      </div>

      {isFreelancer && (
        <>
          <div>
            <Label htmlFor="title">Профессия / заголовок</Label>
            <Input id="title" value={values.title} onChange={(e) => set("title", e.target.value)} maxLength={100} placeholder="Веб-дизайнер" />
          </div>
          <div>
            <Label htmlFor="bio">О себе</Label>
            <Textarea id="bio" value={values.bio} onChange={(e) => set("bio", e.target.value)} maxLength={2000} className="min-h-[120px]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="location">Город</Label>
              <Input id="location" value={values.location} onChange={(e) => set("location", e.target.value)} maxLength={100} />
            </div>
            <div>
              <Label htmlFor="responseTime">Время ответа</Label>
              <Input
                id="responseTime"
                value={values.responseTime}
                onChange={(e) => set("responseTime", e.target.value)}
                maxLength={60}
                placeholder="в течение 2 часов"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="skills">Навыки (через запятую)</Label>
            <Input id="skills" value={values.skills} onChange={(e) => set("skills", e.target.value)} maxLength={300} placeholder="Figma, UI/UX" />
          </div>
        </>
      )}

      <Button type="submit" loading={loading}>
        Сохранить
      </Button>
    </form>
  );
}
