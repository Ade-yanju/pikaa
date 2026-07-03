"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { createCompanyAccount } from "@/app/admin/actions";

function Input({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60"
      />
    </label>
  );
}

export default function AccountCreateForm() {
  const [state, action, pending] = useActionState(createCompanyAccount, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form
      ref={ref}
      action={action}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3"
    >
      <h2 className="text-white font-semibold">Add company account</h2>
      <div className="grid grid-cols-2 gap-3">
        <Input name="label" label="Label" placeholder="US Business (USD)" required />
        <Input name="currency" label="Currency" placeholder="USD" required />
      </div>
      <Input name="account_name" label="Account name" placeholder="Pickar LLC" />
      <Input name="bank_name" label="Bank" placeholder="Chase" />
      <div className="grid grid-cols-2 gap-3">
        <Input name="account_number" label="Account number" placeholder="000123456" />
        <Input name="routing_number" label="Routing / IBAN / SWIFT" placeholder="021000021" />
      </div>
      <Input name="region" label="Region (optional)" placeholder="United States" />

      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state && "ok" in state && state.ok ? (
        <p className="text-sm text-emerald-400">Account added.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold rounded-xl px-4 py-2.5 transition-colors"
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Plus className="w-4 h-4" /> Add account
          </>
        )}
      </button>
    </form>
  );
}
