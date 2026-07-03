import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import ChatRoom from "@/components/ChatRoom";
import type { Conversation, Message } from "@/lib/types";

export const metadata = { title: "Support Chat — Pickar" };

export default async function ChatPage() {
  const profile = await requireUser();
  const supabase = await createClient();

  // Each user has a default conversation (created on signup). Fetch or create.
  let { data: conv } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<Conversation>();

  if (!conv) {
    const { data: created } = await supabase
      .from("conversations")
      .insert({ user_id: profile.id, subject: "Support" })
      .select("*")
      .single<Conversation>();
    conv = created;
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conv!.id)
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <div>
          <p className="text-white text-sm font-semibold">Pickar Support</p>
          <p className="text-xs text-slate-500">
            Typically replies within business hours
          </p>
        </div>
      </div>
      <ChatRoom
        conversationId={conv!.id}
        currentUserId={profile.id}
        viewerRole={profile.role}
        initialMessages={(messages as Message[]) ?? []}
        emptyHint="Send a message to start — ask for your payment details and we'll help."
      />
    </div>
  );
}
