import { SiWhatsapp } from "react-icons/si";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { WHATSAPP_SUPPORT_URL } from "@/lib/constants";
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

  const name = profile.full_name || "";
  const whatsappUrl = `${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(
    `Hi Pickar Support${name ? `, this is ${name}` : ""} — I'd like to continue my conversation here.`,
  )}`;

  return (
    <div className="flex flex-col overflow-hidden bg-[#050505] -mx-5 -mt-7 h-[calc(100dvh_-_8rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] md:mx-0 md:mt-0 md:h-[calc(100vh_-_8rem)] md:rounded-2xl md:border md:border-white/10 md:bg-white/[0.02]">
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold">Pickar Support</p>
          <p className="text-xs text-slate-500">
            Typically replies within business hours
          </p>
        </div>
        {/* Optional, non-mandatory WhatsApp fallback */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          title="Prefer WhatsApp? Continue there"
          className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[#25D366] border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 px-3 py-1.5 rounded-full transition-colors shrink-0"
        >
          <SiWhatsapp className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
      <ChatRoom
        conversationId={conv!.id}
        currentUserId={profile.id}
        viewerRole={profile.role}
        initialMessages={(messages as Message[]) ?? []}
        emptyHint="Send a message to start — ask for your payment details and we'll help."
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
