import Link from "next/link";
import { MapPin, Clock3 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { MessageButton } from "@/components/catalog/message-button";

interface SellerCardProps {
  seller: {
    id: string;
    name: string;
    avatarSeed: string;
    title: string | null;
    isVerified: boolean;
    location: string | null;
    responseTime: string | null;
    memberSince: Date | string;
    servicesCount: number;
  };
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <div className="rounded-xl2 border border-ink-100 bg-cream-50 p-5 shadow-card">
      <Link href={`/freelancers/${seller.id}`} className="flex items-center gap-3">
        <Avatar seed={seller.avatarSeed} name={seller.name} size="lg" verified={seller.isVerified} />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-900">{seller.name}</p>
          {seller.title && <p className="truncate text-sm text-ink-500">{seller.title}</p>}
        </div>
      </Link>

      <dl className="mt-4 space-y-2 text-sm text-ink-500">
        {seller.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-ink-300" /> {seller.location}
          </div>
        )}
        {seller.responseTime && (
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-ink-300" /> Отвечает {seller.responseTime}
          </div>
        )}
        <div className="text-xs text-ink-300">На платформе с {formatDate(seller.memberSince)}</div>
        <div className="text-xs text-ink-300">{seller.servicesCount} услуг на платформе</div>
      </dl>

      <MessageButton recipientId={seller.id} className="mt-4 w-full" />
    </div>
  );
}
