"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { createPaymentRequest } from "@/app/dashboard/actions";

const CURRENCIES = ["USD", "GBP", "EUR", "CAD", "AUD", "NGN", "INR"];

export default function NewRequestForm() {
  const [state, action, pending] = useActionState(createPaymentRequest, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4"
    >
      <h2 className="text-white font-semibold">New payment-details request</h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">Currency</span>
          <select
            name="currency"
            defaultValue="USD"
            className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:border-emerald-500/60"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-[#0b0f0e]">
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Amount (optional)</span>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="1500"
            className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-300">Client / payer (optional)</span>
        <input
          name="client_name"
          placeholder="Acme Inc."
          className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60"
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-300">Purpose / notes (optional)</span>
        <textarea
          name="purpose"
          rows={2}
          placeholder="Web development milestone payment"
          className="mt-1.5 w-full resize-none bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60"
        />
      </label>

      {state?.error ? (
        <p className="text-sm text-red-400">{state.error}</p>
      ) : null}
      {state && "ok" in state && state.ok ? (
        <p className="text-sm text-emerald-400">
          Request submitted — support will respond in your chat.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold rounded-xl px-4 py-3 transition-colors"
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Plus className="w-4 h-4" /> Submit request
          </>
        )}
      </button>
    </form>
  );
}
