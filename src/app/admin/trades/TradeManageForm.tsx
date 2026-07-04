"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateTrade } from "@/app/admin/actions";
import { TRADE_STATUS_LABELS, type Trade, type TradeStatus } from "@/lib/types";

const STATUSES = Object.keys(TRADE_STATUS_LABELS) as TradeStatus[];

export default function TradeManageForm({ trade }: { trade: Trade }) {
  const [state, action, pending] = useActionState(updateTrade, {});

  return (
    <form action={action} className="mt-4 border-t border-white/10 pt-4 space-y-3">
      <input type="hidden" name="id" value={trade.id} />
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs text-slate-400">Status</span>
          <select name="status" defaultValue={trade.status} className={cls}>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-[#0b0f0e]">
                {TRADE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Rate</span>
          <input name="rate" type="number" step="any" defaultValue={trade.rate ?? ""} placeholder="e.g. 1450" className={cls} />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Payout</span>
          <input name="payout_amount" type="number" step="any" defaultValue={trade.payout_amount ?? ""} placeholder="amount" className={cls} />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-slate-400">Note to freelancer (optional)</span>
        <textarea name="admin_note" rows={2} defaultValue={trade.admin_note ?? ""} className={cls} />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Update & notify
        </button>
        {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
        {state && "ok" in state && state.ok && (
          <span className="text-xs text-emerald-400">Saved — freelancer notified.</span>
        )}
      </div>
    </form>
  );
}

const cls =
  "mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60";
