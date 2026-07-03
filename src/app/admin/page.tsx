import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Inbox — Pickar Support" };

type Row = {
  id: string;
  subject: string;
  status: string;
  last_message_at: string;
  profiles: { full_name: string | null; email: string | null; country: string | null } | null;
};

export default async function AdminInbox() {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("conversations")
    .select("id, subject, status, last_message_at, profiles:user_id(full_name, email, country)")
    .order("last_message_at", { ascending: false })
    .limit(100);

  const conversations = (data as unknown as Row[]) ?? [];

  // Last-message preview for the listed conversations.
  const ids = conversations.map((c) => c.id);
  const previews = new Map<string, { body: string; role: string }>();
  if (ids.length) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("conversation_id, body, sender_role, created_at")
      .in("conversation_id", ids)
      .order("created_at", { ascending: false });
    for (const m of msgs ?? []) {
      if (!previews.has(m.conversation_id))
        previews.set(m.conversation_id, { body: m.body, role: m.sender_role });
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">Support inbox</h1>

      {conversations.length === 0 ? (
        <p className="text-slate-500 text-sm">No conversations yet.</p>
      ) : (
        <ul className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden">
          {conversations.map((c) => {
            const p = c.profiles;
            const preview = previews.get(c.id);
            const name = p?.full_name || p?.email || "Unknown user";
            return (
              <li key={c.id}>
                <Link
                  href={`/admin/chat/${c.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="grid place-items-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-medium truncate">
                        {name}
                        {p?.country ? (
                          <span className="text-slate-500 font-normal">
                            {" "}
                            · {p.country}
                          </span>
                        ) : null}
                      </p>
                      <span className="text-[11px] text-slate-500 shrink-0">
                        {new Date(c.last_message_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {preview ? (
                        <>
                          {preview.role === "admin" ? "You: " : ""}
                          {preview.body}
                        </>
                      ) : (
                        <span className="italic">No messages yet</span>
                      )}
                    </p>
                  </div>
                  <MessageSquare className="w-4 h-4 text-slate-600 shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
