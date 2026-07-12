"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { Send, Loader2, ImagePlus, Check, CheckCheck, X, Reply } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markMessagesRead } from "@/app/dashboard/actions";
import SwipeToReply from "@/components/SwipeToReply";
import type { Message, Role } from "@/lib/types";

function senderLabel(
  m: Message,
  currentUserId: string,
  viewerRole: Role,
  names?: Record<string, string>,
) {
  if (m.sender_id === currentUserId) return "You";
  const name = names?.[m.sender_id];
  // Admins see everyone's real name (incl. which teammate replied).
  if (viewerRole === "admin") {
    return name ?? (m.sender_role === "admin" ? "Support" : "Freelancer");
  }
  // Freelancers see support as one team, and each other by name.
  return m.sender_role === "admin" ? "Pickar Support" : name ?? "Freelancer";
}

function preview(m: Message) {
  if (m.body) return m.body;
  if (m.image_url) return "📷 Photo";
  return "Message";
}

const MAX_BYTES = 8 * 1024 * 1024;

// Split text into plain spans + clickable links.
function linkify(text: string) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayLabel(d: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function ChatRoom({
  conversationId,
  currentUserId,
  viewerRole,
  initialMessages,
  emptyHint,
  whatsappUrl,
  names,
}: {
  conversationId: string;
  currentUserId: string;
  viewerRole: Role;
  initialMessages: Message[];
  emptyHint?: string;
  /** When provided (user side), offers an optional WhatsApp fallback. */
  whatsappUrl?: string;
  /** sender_id → display name (admins see freelancer + teammate names). */
  names?: Record<string, string>;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [otherTyping, setOtherTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [, setNowTick] = useState(0); // re-render tick for the wait prompt
  const [waHintDismissed, setWaHintDismissed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  function onReply(m: Message) {
    setReplyingTo(m);
    composerRef.current?.focus();
  }
  const typingChannelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSent = useRef(0);

  const markRead = () => {
    markMessagesRead(conversationId).catch(() => {});
  };

  const typingLabel = viewerRole === "admin" ? "Freelancer" : "Pickar Support";

  function notifyTyping() {
    const now = Date.now();
    if (now - lastTypingSent.current > 1200) {
      lastTypingSent.current = now;
      typingChannelRef.current?.send({
        type: "broadcast",
        event: "typing",
        payload: {},
      });
    }
  }

  // Typing indicator over a broadcast channel.
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase.channel(`typing:${conversationId}`, {
      config: { broadcast: { self: false } },
    });
    ch.on("broadcast", { event: "typing" }, () => {
      setOtherTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setOtherTyping(false), 3000);
    }).subscribe();
    typingChannelRef.current = ch;
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      supabase.removeChannel(ch);
    };
  }, [conversationId]);

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
  }, [messages, pending, uploading, otherTyping]);

  // Tick periodically so the optional "still waiting?" WhatsApp prompt can
  // surface after support has been quiet for a couple of minutes.
  useEffect(() => {
    if (!whatsappUrl || viewerRole === "admin") return;
    const t = setInterval(() => setNowTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, [whatsappUrl, viewerRole]);

  function send(text: string, imageUrl?: string | null, replyTo?: string | null) {
    startTransition(async () => {
      const res = await sendMessage(conversationId, text, imageUrl ?? null, replyTo ?? null);
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
    send(text, null, replyingTo?.id);
    setReplyingTo(null);
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
        send(body.trim(), data.url, replyingTo?.id); // caption + reply
        setBody("");
        setReplyingTo(null);
      }
    } catch {
      setError("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
    }
  }

  // Index of my last message, to anchor the read-receipt line.
  const myLast = [...messages].reverse().find((m) => m.sender_id === currentUserId);

  // Optional WhatsApp fallback: only when the freelancer's last message has
  // gone unanswered by support for a couple of minutes.
  const lastMsg = messages[messages.length - 1];
  const waitingLong =
    !!whatsappUrl &&
    viewerRole !== "admin" &&
    !waHintDismissed &&
    !!lastMsg &&
    lastMsg.sender_id === currentUserId &&
    Date.now() - new Date(lastMsg.created_at).getTime() > 120_000;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-500 mt-10">
            {emptyHint ?? "No messages yet. Say hello 👋"}
          </p>
        ) : (
          messages.map((m, i) => {
            const mine = m.sender_id === currentUserId;
            const fromSupport = m.sender_role === "admin";
            const created = new Date(m.created_at);
            const showDay =
              i === 0 || !sameDay(created, new Date(messages[i - 1].created_at));
            return (
              <Fragment key={m.id}>
                {showDay && (
                  <div className="flex justify-center my-2">
                    <span className="text-[11px] text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {dayLabel(created)}
                    </span>
                  </div>
                )}
                <div className={`group flex items-center gap-1.5 ${mine ? "justify-end" : "justify-start"}`}>
                {mine && (
                  <button
                    type="button"
                    onClick={() => onReply(m)}
                    className="hidden md:group-hover:grid place-items-center w-7 h-7 rounded-full text-slate-500 hover:text-white hover:bg-white/10 shrink-0"
                    aria-label="Reply"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                )}
                <SwipeToReply onReply={() => onReply(m)} className="max-w-[82%]">
                <div
                  className={[
                    "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words",
                    mine
                      ? "bg-emerald-500 text-black rounded-br-sm"
                      : fromSupport
                        ? "bg-white/10 text-slate-100 rounded-bl-sm border border-white/10"
                        : "bg-white/5 text-slate-200 rounded-bl-sm",
                  ].join(" ")}
                >
                  {m.reply_to &&
                    (() => {
                      const ref = messages.find((x) => x.id === m.reply_to);
                      return (
                        <div
                          className={`mb-1.5 rounded-md border-l-2 pl-2 pr-2 py-1 text-xs ${mine ? "border-black/40 bg-black/10" : "border-emerald-400/60 bg-white/5"}`}
                        >
                          <span className="block font-semibold opacity-80">
                            {ref ? senderLabel(ref, currentUserId, viewerRole, names) : "Message"}
                          </span>
                          <span className="block opacity-70 line-clamp-2">
                            {ref ? preview(ref) : "Original message"}
                          </span>
                        </div>
                      );
                    })()}

                  {!mine && (
                    <span className="block text-[11px] font-semibold mb-0.5 opacity-70">
                      {senderLabel(m, currentUserId, viewerRole, names)}
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

                  {m.body && (
                    <span className="whitespace-pre-wrap">{linkify(m.body)}</span>
                  )}

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
                </SwipeToReply>
                {!mine && (
                  <button
                    type="button"
                    onClick={() => onReply(m)}
                    className="hidden md:group-hover:grid place-items-center w-7 h-7 rounded-full text-slate-500 hover:text-white hover:bg-white/10 shrink-0"
                    aria-label="Reply"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                )}
                </div>
              </Fragment>
            );
          })
        )}

        {otherTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-3">
              <span className="sr-only">{typingLabel} is typing</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              </span>
            </div>
          </div>
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

      {waitingLong && whatsappUrl && (
        <div className="mx-3 mb-1 flex items-center gap-3 rounded-xl border border-[#25D366]/25 bg-[#25D366]/[0.06] px-3.5 py-2.5">
          <SiWhatsapp className="w-5 h-5 text-[#25D366] shrink-0" />
          <p className="text-xs text-slate-300 flex-1 leading-snug">
            Support hasn&apos;t replied yet. You can keep waiting here — or
            continue on WhatsApp if you prefer.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-black bg-[#25D366] hover:opacity-90 px-3 py-1.5 rounded-lg shrink-0"
          >
            WhatsApp
          </a>
          <button
            onClick={() => setWaHintDismissed(true)}
            className="text-slate-500 hover:text-white shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {replyingTo && (
        <div className="flex items-stretch gap-2 px-3 pt-2 border-t border-white/10 bg-white/[0.02]">
          <div className="w-1 rounded bg-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0 py-0.5">
            <p className="text-xs font-semibold text-emerald-400">
              Replying to {senderLabel(replyingTo, currentUserId, viewerRole, names)}
            </p>
            <p className="text-xs text-slate-400 truncate">{preview(replyingTo)}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-slate-500 hover:text-white self-center shrink-0"
            aria-label="Cancel reply"
          >
            <X className="w-4 h-4" />
          </button>
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
          ref={composerRef}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            notifyTyping();
          }}
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
