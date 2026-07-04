"use client";

import { useState, useTransition } from "react";
import { Landmark, Loader2, Check } from "lucide-react";
import { shareAccountToConversation } from "@/app/admin/actions";
import type { CompanyAccount } from "@/lib/types";

export default function ShareAccountControl({
  conversationId,
  accounts,
}: {
  conversationId: string;
  accounts: CompanyAccount[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  if (accounts.length === 0) return null;

  function share(accountId: string) {
    start(async () => {
      const res = await shareAccountToConversation(conversationId, accountId);
      if (!res?.error) {
        setDone(true);
        setOpen(false);
        setTimeout(() => setDone(false), 2500);
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : done ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Landmark className="w-3.5 h-3.5" />
        )}
        {done ? "Shared" : "Share account"}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-64 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-[#0b0f0e] shadow-2xl shadow-black/50 p-1">
          {accounts.map((a) => (
            <button
              key={a.id}
              onClick={() => share(a.id)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <p className="text-white text-sm font-medium">
                {a.label} <span className="text-slate-500 font-normal">· {a.currency}</span>
              </p>
              {a.account_number && (
                <p className="text-xs text-slate-500 truncate">{a.account_number}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
