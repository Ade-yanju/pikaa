"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";

export type InboxItem = {
  id: string;
  name: string;
  country: string | null;
  lastAt: string;
  preview: {
    body: string | null;
    image: boolean;
    senderId: string;
    role: "user" | "admin";
  } | null;
  unread: boolean;
};

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const days = (now.getTime() - d.getTime()) / 86_400_000;
  if (days < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString();
}

export default function InboxList({
  initial,
  currentAdminId,
  adminNames,
}: {
  initial: InboxItem[];
  currentAdminId: string;
  adminNames: Record<string, string>;
}) {
  const [items, setItems] = useState<InboxItem[]>(initial);
  const router = useRouter();

  // Live re-order like WhatsApp: newest conversation floats to the top.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("inbox:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as Message;
          setItems((prev) => {
            const idx = prev.findIndex((i) => i.id === row.conversation_id);
            if (idx === -1) {
              router.refresh(); // brand-new conversation — pull it in
              return prev;
            }
            const updated: InboxItem = {
              ...prev[idx],
              lastAt: row.created_at,
              preview: {
                body: row.body,
                image: !!row.image_url,
                senderId: row.sender_id,
                role: row.sender_role,
              },
              unread: row.sender_role === "user",
            };
            const rest = prev.filter((_, i) => i !== idx);
            return [updated, ...rest];
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as Message;
          if (!row.read_at) return;
          setItems((prev) =>
            prev.map((i) =>
              i.id === row.conversation_id ? { ...i, unread: false } : i,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  function previewText(item: InboxItem) {
    const p = item.preview;
    if (!p) return "No messages yet";
    const text = p.image && !p.body ? "📷 Photo" : p.body ?? "";
    if (p.role === "admin") {
      const who =
        p.senderId === currentAdminId ? "You" : adminNames[p.senderId] ?? "Support";
      return `${who}: ${text}`;
    }
    return text;
  }

  if (items.length === 0) {
    return <p className="text-slate-500 text-sm">No conversations yet.</p>;
  }

  return (
    <ul className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden">
      {items.map((c) => (
        <li key={c.id}>
          <Link
            href={`/admin/chat/${c.id}`}
            className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="relative shrink-0">
              <div className="grid place-items-center w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                {c.name.charAt(0).toUpperCase()}
              </div>
              {c.unread && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0f0e]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm truncate ${c.unread ? "text-white font-semibold" : "text-white font-medium"}`}>
                  {c.name}
                  {c.country ? (
                    <span className="text-slate-500 font-normal"> · {c.country}</span>
                  ) : null}
                </p>
                <span className={`text-[11px] shrink-0 ${c.unread ? "text-emerald-400" : "text-slate-500"}`}>
                  {timeLabel(c.lastAt)}
                </span>
              </div>
              <p className={`text-xs truncate mt-0.5 ${c.unread ? "text-slate-200" : "text-slate-500"}`}>
                {previewText(c)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
