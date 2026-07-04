"use client";

import { useTransition } from "react";
import { cancelTrade } from "@/app/dashboard/trade-actions";

export default function CancelTradeButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(async () => { await cancelTrade(id); })}
      disabled={pending}
      className="text-xs text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {pending ? "Cancelling…" : "Cancel"}
    </button>
  );
}
