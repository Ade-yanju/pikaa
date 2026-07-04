import Link from "next/link";
import { Lock, Gift, Bitcoin } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { decryptSecret } from "@/lib/crypto";
import { TRADE_STATUS_LABELS, type Trade } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import TradeManageForm from "./TradeManageForm";

export const metadata = { title: "Trades — Pickar Support" };

type Row = Trade & {
  profiles: { full_name: string | null; email: string | null } | null;
};

export default async function AdminTradesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireAdmin();
  const { type } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trades")
    .select("*, profiles:user_id(full_name, email)")
    .order("created_at", { ascending: false });
  if (type === "gift_card" || type === "crypto") query = query.eq("type", type);

  const { data } = await query;
  const rows = (data as unknown as Row[]) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Trades</h1>
        <div className="flex items-center gap-1 text-xs">
          <Filter label="All" href="/admin/trades" active={!type} />
          <Filter label="Gift cards" href="/admin/trades?type=gift_card" active={type === "gift_card"} />
          <Filter label="Crypto" href="/admin/trades?type=crypto" active={type === "crypto"} />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-500 text-sm">No trades yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((t) => {
            const secret = decryptSecret(t.secret_encrypted);
            return (
              <li key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 text-emerald-400 shrink-0">
                      {t.type === "gift_card" ? <Gift className="w-4 h-4" /> : <Bitcoin className="w-4 h-4" />}
                    </span>
                    <div>
                      <p className="text-white font-semibold">
                        {t.side === "buy" ? "Buy " : t.side === "sell" && t.type === "crypto" ? "Sell " : ""}
                        {t.asset} {t.amount ?? ""} {t.currency ?? ""}
                        {t.network ? <span className="text-slate-500 font-normal"> · {t.network}</span> : null}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t.profiles?.full_name || t.profiles?.email || "Unknown"} ·{" "}
                        {new Date(t.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={t.status} label={TRADE_STATUS_LABELS[t.status]} />
                    {t.conversation_id && (
                      <Link href={`/admin/chat/${t.conversation_id}`} className="text-xs text-emerald-400 hover:text-emerald-300">
                        Open chat →
                      </Link>
                    )}
                  </div>
                </div>

                {(secret || t.image_url) && (
                  <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-sm">
                    <p className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                      <Lock className="w-3 h-3" /> Decrypted details (admin only)
                    </p>
                    {secret && (
                      <p className="text-white font-mono text-sm break-all select-all">{secret}</p>
                    )}
                    {t.image_url && (
                      <a href={t.image_url} target="_blank" rel="noreferrer" className="text-emerald-400 text-xs">
                        View uploaded photo →
                      </a>
                    )}
                  </div>
                )}

                <TradeManageForm trade={t} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Filter({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "text-slate-400 border-white/10 hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}
