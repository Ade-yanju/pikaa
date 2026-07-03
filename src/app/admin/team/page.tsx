import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import RoleToggle from "./RoleToggle";

export const metadata = { title: "Team & Admins — Pickar Support" };

export default async function TeamPage() {
  const me = await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = (data as Profile[]) ?? [];
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Team & Admins</h1>
        <span className="text-xs text-slate-500">
          {users.length} users · {admins} admin{admins === 1 ? "" : "s"}
        </span>
      </div>
      <p className="text-sm text-slate-400">
        Promote a registered user to admin to give them access to this Support
        Console. Revoke it to return them to a normal account.
      </p>

      <ul className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden">
        {users.map((u) => {
          const name = u.full_name || u.email || "Unknown";
          const isMe = u.id === me.id;
          return (
            <li
              key={u.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="grid place-items-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">
                  {name}
                  {isMe && (
                    <span className="text-slate-500 font-normal"> · You</span>
                  )}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {u.email}
                  {u.country ? ` · ${u.country}` : ""}
                </p>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${
                  u.role === "admin"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                }`}
              >
                {u.role}
              </span>

              {isMe ? (
                <span className="text-xs text-slate-600 w-[104px] text-right">
                  —
                </span>
              ) : (
                <RoleToggle userId={u.id} role={u.role} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
