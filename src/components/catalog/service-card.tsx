import Link from "next/link";
import { GeneratedCover } from "@/components/ui/generated-cover";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";

export interface ServiceCardData {
  slug: string;
  title: string;
  coverSeed: string;
  rating: number;
  ratingCount: number;
  ordersCount: number;
  category: { slug: string; name: string; icon: string };
  seller: { id: string; name: string; avatarSeed: string; isVerified: boolean };
  startingPriceCents: number;
}

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-ink-100 bg-cream-50 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <GeneratedCover seed={service.coverSeed} icon={service.category.icon} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Avatar seed={service.seller.avatarSeed} name={service.seller.name} size="sm" verified={service.seller.isVerified} />
          <span className="truncate text-sm text-ink-500">{service.seller.name}</span>
        </div>
        <h3 className="mb-2 line-clamp-2 min-h-[2.6em] font-display text-[1.05rem] font-medium leading-snug text-ink-900 group-hover:text-rust-600">
          {service.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          {service.ratingCount > 0 ? (
            <Rating value={service.rating} count={service.ratingCount} />
          ) : (
            <span className="text-xs text-ink-300">Пока нет отзывов</span>
          )}
          <div className="text-right">
            <span className="block text-[0.7rem] uppercase tracking-wide text-ink-300">от</span>
            <span className="font-display font-semibold text-ink-900">{formatPrice(service.startingPriceCents)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
