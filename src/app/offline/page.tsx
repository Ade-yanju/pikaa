import type { Metadata } from "next";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = { title: "Offline — Pickar" };

export default function OfflinePage() {
  return (
    <div className="min-h-[100dvh] bg-[#050505] text-slate-200 flex flex-col items-center justify-center text-center px-6">
      <span className="grid place-items-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-slate-400">
        <WifiOff className="w-7 h-7" />
      </span>
      <h1 className="text-2xl font-bold text-white mt-6">You&apos;re offline</h1>
      <p className="text-slate-400 mt-2 max-w-sm">
        Pickar needs an internet connection for chat and transactions. Check your
        connection and try again.
      </p>
      <a
        href="/dashboard"
        className="mt-6 inline-flex items-center justify-center text-sm font-semibold text-black bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-full transition-colors"
      >
        Retry
      </a>
    </div>
  );
}
