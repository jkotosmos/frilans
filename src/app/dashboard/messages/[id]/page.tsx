import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getConversationThread } from "@/lib/queries/messages";
import { Avatar } from "@/components/ui/avatar";
import { ChatThread } from "@/components/dashboard/chat-thread";

export const metadata: Metadata = { title: "Диалог" };

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const thread = await getConversationThread(params.id, user.id);
  if (!thread) notFound();

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col overflow-hidden rounded-xl2 border border-ink-100 bg-cream-50 shadow-card">
      <div className="flex items-center gap-3 border-b border-ink-100 p-4">
        <Link href="/dashboard/messages" className="text-ink-400 hover:text-ink-600">
          <ChevronLeft className="size-5" />
        </Link>
        <Avatar seed={thread.other.avatarSeed} name={thread.other.name} size="sm" />
        {thread.other.role === "FREELANCER" ? (
          <Link href={`/freelancers/${thread.other.id}`} className="font-medium text-ink-900 hover:underline">
            {thread.other.name}
          </Link>
        ) : (
          <span className="font-medium text-ink-900">{thread.other.name}</span>
        )}
      </div>
      <div className="min-h-0 flex-1">
        <ChatThread conversationId={thread.id} currentUserId={user.id} messages={thread.messages} />
      </div>
    </div>
  );
}
