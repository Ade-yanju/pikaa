"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessagesSquare, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";

type Toast = { id: string; text: string; href: string };

export default function MessageNotifier({
  currentUserId,
  surface,
  ownConversationId,
}: {
  currentUserId: string;
  // "admin" = support console (all conversations); "user" = only my own thread.
  surface: "user" | "admin";
  ownConversationId?: string | null;
}) {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unread, setUnread] = useState(0);
  const baseTitle = useRef<string>("");

  // Are we currently looking at the chat surface? (suppress self-notifications)
  const onChat =
    pathname.startsWith("/dashboard/chat") || pathname.startsWith("/admin/chat");

  // Ref mirror so the realtime callback always reads the latest value.
  const onChatRef = useRef(onChat);
  useEffect(() => {
    onChatRef.current = onChat;
  }, [onChat]);

  useEffect(() => {
    baseTitle.current = document.title.replace(/^\(\d+\)\s*/, "");
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Clear the badge whenever we land on a chat view.
  useEffect(() => {
    if (onChat) setUnread(0);
  }, [onChat, pathname]);

  useEffect(() => {
    document.title = unread > 0 ? `(${unread}) ${baseTitle.current}` : baseTitle.current;
  }, [unread]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("notify:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as Message;
          if (row.sender_id === currentUserId) return; // not my own

          // On the user dashboard only notify about MY conversation — even if
          // this account is an admin (who can technically read every thread).
          if (surface === "user" && ownConversationId && row.conversation_id !== ownConversationId) {
            return;
          }

          const href =
            surface === "admin" ? `/admin/chat/${row.conversation_id}` : "/dashboard/chat";
          const who = surface === "admin" ? "New message from a freelancer" : "Pickar Support replied";
          const preview = row.image_url ? "📷 Photo" : (row.body ?? "");
          const text = preview ? `${who}: ${preview.slice(0, 60)}` : who;

          // If we're already reading chat, don't nag.
          if (onChatRef.current) return;

          setUnread((n) => n + 1);
          const id = `${row.id}`;
          setToasts((t) => [...t, { id, text, href }]);
          setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);

          if ("Notification" in window && Notification.permission === "granted") {
            try {
              new Notification("Pickar", { body: text, icon: "/pickar.png" });
            } catch {
              /* ignore */
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, surface, ownConversationId]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[calc(5rem_+_env(safe-area-inset-top))] right-4 z-[60] flex flex-col gap-2 w-[min(92vw,340px)]">
      {toasts.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
          className="group flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-[#0b0f0e]/95 backdrop-blur-xl p-3.5 shadow-2xl shadow-black/50 animate-in"
        >
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
            <MessagesSquare className="w-4 h-4" />
          </span>
          <p className="text-sm text-slate-200 flex-1 leading-snug">{t.text}</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              setToasts((x) => x.filter((y) => y.id !== t.id));
            }}
            className="text-slate-500 hover:text-white"
            aria-label="dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </Link>
      ))}
    </div>
  );
}
