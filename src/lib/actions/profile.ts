"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { profileUpdateSchema } from "@/lib/validations/misc";
import type { ActionResult } from "@/lib/actions/auth";

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войдите в аккаунт" };

  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title") || "",
    bio: formData.get("bio") || "",
    location: formData.get("location") || "",
    skills: formData.get("skills") || "",
    responseTime: formData.get("responseTime") || "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте форму" };

  const { name, title, bio, location, skills, responseTime } = parsed.data;

  await db.user.update({
    where: { id: user.id },
    data: {
      name,
      title: title || null,
      bio: bio || null,
      location: location || null,
      skills: skills || null,
      responseTime: responseTime || null,
    },
  });

  revalidatePath("/dashboard/settings");
  return { ok: true };
}
