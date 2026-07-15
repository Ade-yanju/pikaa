import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import ChatRoom from "@/components/ChatRoom";
import ShareAccountControl from "@/components/ShareAccountControl";
import type { CompanyAccount, Message } from "@/lib/types";

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const admin = await requireAdmin();
  const { conversationId } = await params;
  const supabase = await createClient();

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, subject, user_id, profiles:user_id(full_name, email, country)")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conv) notFound();

  const convRow = conv as unknown as {
    user_id: string;
    profiles: { full_name: string | null; email: string | null; country: string | null } | null;
  };
  const profile = convRow.profiles;

  const [{ data: messages }, { data: accounts }, { data: admins }] =
    await Promise.all([
      supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true }),
      supabase
        .from("company_accounts")
        .select("*")
        .eq("is_active", true)
        .order("currency"),
      supabase.from("profiles").select("id, full_name, email").eq("role", "admin"),
    ]);

  const name = profile?.full_name || profile?.email || "Freelancer";

  // sender_id → display name, so admins see the freelancer's real name and
  // which teammate replied.
  const names: Record<string, string> = { [convRow.user_id]: name };
  for (const a of admins ?? []) {
    names[a.id] = a.full_name || a.email || "Support";
  }

  // Awareness: has a teammate already replied here?
  const msgs = (messages as Message[]) ?? [];
  const lastAdminMsg = [...msgs].reverse().find((m) => m.sender_role === "admin");
  const handledBy = lastAdminMsg
    ? lastAdminMsg.sender_id === admin.id
      ? "You"
      : (lastAdminMsg.sender_id ? names[lastAdminMsg.sender_id] : undefined) ??
        "A teammate"
    : null;

  return (
    <div className="flex flex-col overflow-hidden bg-[#050505] -mx-5 -mt-7 h-[calc(100dvh_-_8rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] md:mx-0 md:mt-0 md:h-[calc(100vh_-_8rem)] md:rounded-2xl md:border md:border-white/10 md:bg-white/[0.02]">
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
        <Link
          href="/admin"
          className="text-slate-400 hover:text-white md:hidden"
          aria-label="Back to inbox"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="grid place-items-center w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">
            {profile?.email}
            {profile?.country ? ` · ${profile.country}` : ""}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ShareAccountControl
            conversationId={conversationId}
            accounts={(accounts as CompanyAccount[]) ?? []}
          />
          <Link
            href="/admin/requests"
            className="hidden sm:inline text-xs text-emerald-400 hover:text-emerald-300"
          >
            Requests →
          </Link>
        </div>
      </div>

      {handledBy && (
        <div className="px-5 py-2 bg-emerald-500/[0.06] border-b border-emerald-500/15 text-xs text-emerald-300/90 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {handledBy === "You"
            ? "You last replied in this conversation."
            : `${handledBy} (support) has already replied here — check the thread before responding.`}
        </div>
      )}

      <ChatRoom
        conversationId={conversationId}
        currentUserId={admin.id}
        viewerRole="admin"
        initialMessages={msgs}
        emptyHint="No messages from this freelancer yet."
        names={names}
      />
    </div>
  );
}
