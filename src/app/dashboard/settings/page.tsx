import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = { title: "Настройки" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Настройки профиля</h1>
      <p className="mt-1 text-ink-500">Эти данные видят другие пользователи платформы</p>
      <div className="mt-6">
        <SettingsForm
          isFreelancer={user.role === "FREELANCER"}
          initial={{
            name: dbUser.name,
            title: dbUser.title ?? "",
            bio: dbUser.bio ?? "",
            location: dbUser.location ?? "",
            skills: dbUser.skills ?? "",
            responseTime: dbUser.responseTime ?? "",
          }}
        />
      </div>
    </div>
  );
}
