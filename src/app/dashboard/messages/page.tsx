import Link from "next/link";
import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getConversationsForUser } from "@/lib/queries/messages";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Сообщения" };

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const conversations = await getConversationsForUser(user.id);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Сообщения</h1>

      <div className="mt-6 overflow-hidden rounded-xl2 border border-ink-100 bg-cream-50 shadow-card">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <MessageSquare className="size-9 text-ink-300" />
            <p className="mt-3 text-sm text-ink-400">Диалогов пока нет</p>
          </div>
        ) : (
          <ul>
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/messages/${c.id}`}
                  className="flex items-center gap-3 border-b border-ink-100 p-4 transition-colors last:border-0 hover:bg-ink-50"
                >
                  <Avatar seed={c.other.avatarSeed} name={c.other.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-ink-900">{c.other.name}</p>
                      {c.lastMessage && (
                        <span className="shrink-0 text-xs text-ink-300" suppressHydrationWarning>
                          {formatRelativeDate(c.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-ink-500">{c.lastMessage?.body ?? "Нет сообщений"}</p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rust-500 text-xs font-medium text-cream-50">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
