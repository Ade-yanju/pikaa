import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import InboxList, { type InboxItem } from "./InboxList";

export const metadata = { title: "Inbox — Pickar Support" };

type ConvRow = {
  id: string;
  last_message_at: string;
  profiles: { full_name: string | null; email: string | null; country: string | null } | null;
};

type MsgRow = {
  conversation_id: string;
  body: string | null;
  image_url: string | null;
  sender_id: string | null;
  sender_role: "user" | "admin" | "system";
  read_at: string | null;
};

export default async function AdminInbox() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [{ data: convs }, { data: admins }] = await Promise.all([
    supabase
      .from("conversations")
      .select("id, last_message_at, profiles:user_id(full_name, email, country)")
      .order("last_message_at", { ascending: false })
      .limit(100),
    supabase.from("profiles").select("id, full_name, email").eq("role", "admin"),
  ]);

  const conversations = (convs as unknown as ConvRow[]) ?? [];
  const adminNames: Record<string, string> = {};
  for (const a of admins ?? []) adminNames[a.id] = a.full_name || a.email || "Support";

  // Last message per conversation (for preview + unread state).
  const ids = conversations.map((c) => c.id);
  const previews = new Map<string, MsgRow>();
  if (ids.length) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("conversation_id, body, image_url, sender_id, sender_role, read_at")
      .in("conversation_id", ids)
      .order("created_at", { ascending: false });
    for (const m of (msgs as MsgRow[]) ?? []) {
      if (!previews.has(m.conversation_id)) previews.set(m.conversation_id, m);
    }
  }

  const items: InboxItem[] = conversations.map((c) => {
    const p = previews.get(c.id);
    return {
      id: c.id,
      name: c.profiles?.full_name || c.profiles?.email || "Unknown user",
      country: c.profiles?.country ?? null,
      lastAt: c.last_message_at,
      preview: p
        ? {
            body: p.body,
            image: !!p.image_url,
            senderId: p.sender_id,
            role: p.sender_role,
          }
        : null,
      unread: !!p && p.sender_role === "user" && !p.read_at,
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">Support inbox</h1>
      <InboxList initial={items} currentAdminId={admin.id} adminNames={adminNames} />
    </div>
  );
}
