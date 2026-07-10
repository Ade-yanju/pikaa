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
    .select("id, subject, profiles:user_id(full_name, email, country)")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conv) notFound();

  const profile = (conv as unknown as {
    profiles: { full_name: string | null; email: string | null; country: string | null } | null;
  }).profiles;

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const { data: accounts } = await supabase
    .from("company_accounts")
    .select("*")
    .eq("is_active", true)
    .order("currency");

  const name = profile?.full_name || profile?.email || "Freelancer";

  return (
    <div className="flex flex-col h-[calc(100dvh_-_12rem_-_env(safe-area-inset-bottom))] md:h-[calc(100vh_-_8rem)] rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
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

      <ChatRoom
        conversationId={conversationId}
        currentUserId={admin.id}
        viewerRole="admin"
        initialMessages={(messages as Message[]) ?? []}
        emptyHint="No messages from this freelancer yet."
      />
    </div>
  );
}
