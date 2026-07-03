"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { Send, Loader2, ImagePlus, Check, CheckCheck, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markMessagesRead } from "@/app/dashboard/actions";
import type { Message, Role } from "@/lib/types";

const MAX_BYTES = 8 * 1024 * 1024;

export default function ChatRoom({
  conversationId,
  currentUserId,
  viewerRole,
  initialMessages,
  emptyHint,
}: {
  conversationId: string;
  currentUserId: string;
  viewerRole: Role;
  initialMessages: Message[];
  emptyHint?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const markRead = () => {
    markMessagesRead(conversationId).catch(() => {});
  };

  // Live updates: new messages (INSERT) and read receipts (UPDATE).
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === row.id) ? prev : [...prev, row],
          );
          if (row.sender_id !== currentUserId) markRead();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === row.id ? { ...m, ...row } : m)),
          );
        },
      )
      .subscribe();

    markRead(); // mark anything already unread on open
    const onFocus = () => markRead();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending, uploading]);

  function send(text: string, imageUrl?: string | null) {
    startTransition(async () => {
      const res = await sendMessage(conversationId, text, imageUrl ?? null);
      if (res?.error) {
        setError(res.error);
        if (!imageUrl) setBody(text);
      }
    });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || pending) return;
    setError(null);
    setBody("");
    send(text);
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large (max 8 MB).");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed.");
      } else {
        send(body.trim(), data.url); // send with optional caption
        setBody("");
      }
    } catch {
      setError("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
    }
  }

  // Index of my last message, to anchor the read-receipt line.
  const myLast = [...messages].reverse().find((m) => m.sender_id === currentUserId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-500 mt-10">
            {emptyHint ?? "No messages yet. Say hello 👋"}
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            const fromSupport = m.sender_role === "admin";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={[
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words",
                    mine
                      ? "bg-emerald-500 text-black rounded-br-sm"
                      : fromSupport
                        ? "bg-white/10 text-slate-100 rounded-bl-sm border border-white/10"
                        : "bg-white/5 text-slate-200 rounded-bl-sm",
                  ].join(" ")}
                >
                  {!mine && (
                    <span className="block text-[11px] font-semibold mb-0.5 opacity-70">
                      {fromSupport ? "Pickar Support" : "Freelancer"}
                    </span>
                  )}

                  {m.image_url && (
                    <a href={m.image_url} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.image_url}
                        alt="attachment"
                        className="rounded-lg max-h-64 w-auto mb-1.5 border border-black/10"
                      />
                    </a>
                  )}

                  {m.body && <span className="whitespace-pre-wrap">{m.body}</span>}

                  <span
                    className={`flex items-center gap-1 justify-end text-[10px] mt-1 ${mine ? "text-black/50" : "text-slate-500"}`}
                  >
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {mine &&
                      (m.read_at ? (
                        <CheckCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      ))}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {myLast?.read_at && (
          <p className="text-right text-[11px] text-slate-500 pr-1">Seen</p>
        )}
        {uploading && (
          <div className="flex justify-end">
            <span className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 rounded-full px-3 py-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading image…
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="px-4 pb-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
            {error}
            <button onClick={() => setError(null)} aria-label="dismiss">
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      <form
        onSubmit={submit}
        className="border-t border-white/10 p-3 flex items-end gap-2 bg-[#050505]/60"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPickImage}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || pending}
          className="grid place-items-center w-11 h-11 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors shrink-0"
          aria-label="Attach image"
        >
          <ImagePlus className="w-5 h-5" />
        </button>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) submit(e);
          }}
          rows={1}
          placeholder={
            viewerRole === "admin"
              ? "Reply to the freelancer…"
              : "Message Pickar support…"
          }
          className="flex-1 resize-none max-h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60 transition-colors"
        />
        <button
          type="submit"
          disabled={pending || uploading || !body.trim()}
          className="grid place-items-center w-11 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black transition-colors shrink-0"
          aria-label="Send"
        >
          {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
