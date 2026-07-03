"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updatePaymentRequest } from "@/app/admin/actions";
import {
  PAYMENT_STATUS_LABELS,
  type CompanyAccount,
  type PaymentRequest,
  type PaymentRequestStatus,
} from "@/lib/types";

const STATUSES = Object.keys(PAYMENT_STATUS_LABELS) as PaymentRequestStatus[];

export default function RequestManageForm({
  request,
  accounts,
}: {
  request: PaymentRequest;
  accounts: CompanyAccount[];
}) {
  const [state, action, pending] = useActionState(updatePaymentRequest, {});

  return (
    <form action={action} className="mt-4 border-t border-white/10 pt-4 space-y-3">
      <input type="hidden" name="id" value={request.id} />

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-slate-400">Status</span>
          <select
            name="status"
            defaultValue={request.status}
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/60"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-[#0b0f0e]">
                {PAYMENT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-slate-400">Share account</span>
          <select
            name="account_id"
            defaultValue={request.account_id ?? ""}
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/60"
          >
            <option value="" className="bg-[#0b0f0e]">
              — none —
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#0b0f0e]">
                {a.label} ({a.currency})
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-slate-400">Note to freelancer (optional)</span>
        <textarea
          name="admin_note"
          rows={2}
          defaultValue={request.admin_note ?? ""}
          placeholder="Any instructions…"
          className="mt-1 w-full resize-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60"
        />
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
        {state?.error ? (
          <span className="text-xs text-red-400">{state.error}</span>
        ) : null}
        {state && "ok" in state && state.ok ? (
          <span className="text-xs text-emerald-400">Saved — freelancer notified.</span>
        ) : null}
        <span className="ml-auto text-xs text-slate-500">
          Sharing an account posts the details into their chat.
        </span>
      </div>
    </form>
  );
}
