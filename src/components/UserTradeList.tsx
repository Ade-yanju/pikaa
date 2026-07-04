import Link from "next/link";
import { Lock } from "lucide-react";
import { TRADE_STATUS_LABELS, type Trade } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import CancelTradeButton from "@/components/CancelTradeButton";

const CANCELLABLE = ["pending", "in_review", "accepted"];

export default function UserTradeList({
  trades,
  emptyText,
}: {
  trades: Trade[];
  emptyText: string;
}) {
  if (trades.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <p className="text-slate-400 text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {trades.map((t) => (
        <li key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-white font-semibold">
                {t.side === "buy" ? "Buy" : t.side === "sell" && t.type === "crypto" ? "Sell" : ""}{" "}
                {t.asset} {t.amount ?? ""} {t.currency ?? ""}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.network ? `${t.network} · ` : ""}
                {new Date(t.created_at).toLocaleString()}
              </p>
            </div>
            <StatusBadge status={t.status} label={TRADE_STATUS_LABELS[t.status]} />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-sm">
            {t.rate != null && <Info k="Rate" v={String(t.rate)} />}
            {t.payout_amount != null && (
              <Info k="Payout" v={`${t.currency ?? ""} ${t.payout_amount}`} accent />
            )}
            {t.image_url && (
              <a href={t.image_url} target="_blank" rel="noreferrer" className="text-emerald-400 text-xs">
                View photo
              </a>
            )}
            {t.secret_encrypted && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Lock className="w-3 h-3 text-emerald-400" /> Details encrypted
              </span>
            )}
          </div>

          {t.admin_note && (
            <p className="text-sm text-slate-300 mt-3 border-l-2 border-emerald-500/40 pl-3">
              {t.admin_note}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <Link href="/dashboard/chat" className="text-xs text-emerald-400 hover:text-emerald-300">
              Discuss in chat →
            </Link>
            {CANCELLABLE.includes(t.status) && <CancelTradeButton id={t.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Info({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <span className="text-xs">
      <span className="text-slate-500">{k}: </span>
      <span className={accent ? "text-emerald-400 font-semibold" : "text-white"}>{v}</span>
    </span>
  );
}
