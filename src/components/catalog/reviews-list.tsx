import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { formatRelativeDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  author: { name: string; avatarSeed: string };
}

export function ReviewsList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl2 border border-dashed border-ink-200 py-12 text-center">
        <MessageSquare className="size-8 text-ink-300" />
        <p className="mt-3 text-sm text-ink-400">Пока нет отзывов — станьте первым заказчиком</p>
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {reviews.map((review) => (
        <li key={review.id} className="flex gap-3 border-b border-ink-100 pb-5 last:border-0">
          <Avatar seed={review.author.avatarSeed} name={review.author.name} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-ink-900">{review.author.name}</span>
              <span className="text-xs text-ink-300" suppressHydrationWarning>
                {formatRelativeDate(review.createdAt)}
              </span>
            </div>
            <Rating value={review.rating} showValue={false} stars className="mt-1" />
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{review.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
