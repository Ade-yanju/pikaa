"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Plus, Lock, Trash2, Banknote } from "lucide-react";
import {
  addWithdrawalDetail,
  deleteWithdrawalDetail,
} from "@/app/dashboard/withdrawal-actions";
import { WITHDRAWAL_METHOD_LABELS, type WithdrawalMethod } from "@/lib/types";

export type WithdrawalView = {
  id: string;
  method: WithdrawalMethod;
  label: string | null;
  account_name: string | null;
  bank_name: string | null;
  masked: string; // e.g. "•••• 4321"
  currency: string | null;
};

const METHODS = Object.keys(WITHDRAWAL_METHOD_LABELS) as WithdrawalMethod[];

export default function WithdrawalManager({ items }: { items: WithdrawalView[] }) {
  const [state, action, pending] = useActionState(addWithdrawalDetail, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <h2 className="text-lg font-bold text-white">Withdrawal details</h2>
        <p className="text-slate-400 text-sm mt-1">
          Where you&apos;d like to be paid. Sensitive fields are encrypted and only
          visible to Pickar support.
        </p>
      </div>

      {items.length > 0 && (
        <ul className="space-y-2.5">
          {items.map((w) => (
            <li
              key={w.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5"
            >
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Banknote className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">
                  {w.label || WITHDRAWAL_METHOD_LABELS[w.method]}
                  {w.currency ? (
                    <span className="text-slate-500 font-normal"> · {w.currency}</span>
                  ) : null}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {w.account_name ? `${w.account_name} · ` : ""}
                  {w.bank_name ? `${w.bank_name} · ` : ""}
                  {w.masked}
                </p>
              </div>
              <DeleteButton id={w.id} />
            </li>
          ))}
        </ul>
      )}

      <form
        ref={formRef}
        action={action}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3"
      >
        <p className="text-sm font-semibold text-white">Add a payout method</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-slate-400">Method</span>
            <select name="method" defaultValue="bank" className={cls}>
              {METHODS.map((m) => (
                <option key={m} value={m} className="bg-[#0b0f0e]">
                  {WITHDRAWAL_METHOD_LABELS[m]}
                </option>
              ))}
            </select>
          </label>
          <Input name="currency" label="Currency" placeholder="USD" />
        </div>
        <Input name="account_name" label="Account holder name" placeholder="Jane Doe" />
        <Input name="bank_name" label="Bank / provider (optional)" placeholder="Chase" />
        <Input
          name="account_number"
          label="Account number / wallet / email"
          placeholder="Account no., wallet address, or PayPal email"
          required
          lock
        />
        <Input
          name="routing"
          label="Routing / IBAN / SWIFT / tag (optional)"
          placeholder="e.g. 021000021"
          lock
        />
        <Input name="label" label="Nickname (optional)" placeholder="My main account" />

        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
        {state && "ok" in state && state.ok && (
          <p className="text-sm text-emerald-400">Saved &amp; encrypted.</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold rounded-xl px-4 py-2.5 transition-colors"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add payout method
        </button>
      </form>
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(async () => { await deleteWithdrawalDetail(id); })}
      disabled={pending}
      className="text-slate-500 hover:text-red-400 transition-colors shrink-0 disabled:opacity-50"
      aria-label="Remove"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

function Input({
  name,
  label,
  placeholder,
  required,
  lock,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  lock?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 flex items-center gap-1.5">
        {label} {lock && <Lock className="w-3 h-3 text-emerald-400" />}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className={cls}
      />
    </label>
  );
}

const cls =
  "mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60";
