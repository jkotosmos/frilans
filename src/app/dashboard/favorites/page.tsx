import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getFavoritesForUser } from "@/lib/static-data";
import { FavoriteCard } from "@/components/dashboard/favorite-card";

export const metadata: Metadata = { title: "Избранное" };

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const favorites = await getFavoritesForUser(user.id);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Избранное</h1>

      {favorites.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl2 border border-dashed border-ink-200 py-16 text-center">
          <Heart className="size-9 text-ink-300" />
          <p className="mt-3 text-sm text-ink-400">Вы ещё не добавили услуги в избранное</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <FavoriteCard key={f.favoriteServiceId} serviceId={f.favoriteServiceId} service={f.service} />
          ))}
        </div>
      )}
    </div>
  );
}
