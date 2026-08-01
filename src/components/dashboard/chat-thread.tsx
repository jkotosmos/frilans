"use client";

import { useRef, useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { demoAction } from "@/lib/demo-actions";

interface MessageItem {
  id: string;
  body: string;
  createdAt: Date | string;
  author: { id: string; name: string; avatarSeed: string };
}

export function ChatThread({
  currentUserId,
  messages,
}: {
  conversationId: string;
  currentUserId: string;
  messages: MessageItem[];
}) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    demoAction();
    setLoading(false);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((m) => {
          const mine = m.author.id === currentUserId;
          return (
            <div key={m.id} className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
              <Avatar seed={m.author.avatarSeed} name={m.author.name} size="sm" />
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  mine ? "rounded-br-sm bg-rust-500 text-cream-50" : "rounded-bl-sm bg-ink-50 text-ink-800"
                )}
              >
                <p className="whitespace-pre-line">{m.body}</p>
                <p className={cn("mt-1 text-[0.7rem]", mine ? "text-rust-100" : "text-ink-300")} suppressHydrationWarning>
                  {formatRelativeDate(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-ink-100 p-4">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={4000}
          placeholder="Напишите сообщение…"
          className="h-11 flex-1 rounded-full border border-ink-200 bg-cream-50 px-4 text-sm outline-none focus:border-rust-400 focus:ring-2 focus:ring-rust-100"
        />
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rust-500 text-cream-50 transition-colors hover:bg-rust-600 disabled:opacity-50"
          aria-label="Отправить"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
