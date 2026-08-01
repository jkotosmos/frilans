import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { getUserProfile } from "@/lib/static-data";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = { title: "Настройки" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getUserProfile(user.id);
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Настройки профиля</h1>
      <p className="mt-1 text-ink-500">Эти данные видят другие пользователи платформы</p>
      <div className="mt-6">
        <SettingsForm
          isFreelancer={user.role === "FREELANCER"}
          initial={{
            name: profile.name,
            title: profile.title ?? "",
            bio: profile.bio ?? "",
            location: profile.location ?? "",
            skills: profile.skills ?? "",
            responseTime: profile.responseTime ?? "",
          }}
        />
      </div>
    </div>
  );
}
