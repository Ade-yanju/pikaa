"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus, Lock } from "lucide-react";
import { createCryptoTrade } from "@/app/dashboard/trade-actions";

const ASSETS = ["BTC", "ETH", "USDT", "USDC", "BNB", "SOL", "TRX", "LTC", "XRP", "Other"];
const NETWORKS = ["", "Bitcoin", "ERC20", "TRC20", "BEP20", "Solana", "Polygon", "Lightning"];

export default function NewCryptoForm() {
  const [state, action, pending] = useActionState(createCryptoTrade, {});
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
      <h2 className="text-white font-semibold">Trade cryptocurrency</h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">I want to</span>
          <select name="side" defaultValue="sell" className={inputCls}>
            <option value="sell" className="bg-[#0b0f0e]">Sell</option>
            <option value="buy" className="bg-[#0b0f0e]">Buy</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Asset</span>
          <select name="asset" defaultValue="USDT" className={inputCls}>
            {ASSETS.map((a) => (
              <option key={a} value={a} className="bg-[#0b0f0e]">{a}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">Network</span>
          <select name="network" defaultValue="TRC20" className={inputCls}>
            {NETWORKS.map((n) => (
              <option key={n} value={n} className="bg-[#0b0f0e]">{n || "—"}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Amount</span>
          <input name="amount" type="number" step="any" min="0" placeholder="500" required className={inputCls} />
        </label>
      </div>

      <input type="hidden" name="currency" value="USD" />

      <label className="block">
        <span className="text-sm text-slate-300 flex items-center gap-1.5">
          Wallet address (optional) <Lock className="w-3 h-3 text-emerald-400" />
        </span>
        <input name="secret" placeholder="Encrypted before storage" className={inputCls} />
        <span className="text-[11px] text-slate-500 mt-1 block">
          Encrypted at rest — shared only with support to settle your trade.
        </span>
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state && "ok" in state && state.ok && (
        <p className="text-sm text-emerald-400">Submitted — support will quote you in chat.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold rounded-xl px-4 py-3 transition-colors"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Submit trade</>}
      </button>
    </form>
  );
}

const inputCls =
  "mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60 transition-colors";
