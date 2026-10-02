"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Copy, Gift, Link2, Sparkles, Users, Wallet } from "lucide-react";
import type { AffiliateReward } from "@/lib/types";

export default function AffiliatePanel({
  code,
  rewards,
}: {
  code: string;
  rewards: AffiliateReward[];
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const signups = rewards.filter((reward) => reward.reward_type === "signup");
  const tradeRewards = rewards.filter((reward) => reward.reward_type === "trade");
  const signupEarnings = signups.reduce((total, reward) => total + Number(reward.amount), 0);
  useEffect(() => setOrigin(window.location.origin), []);
  const shareUrl = code ? `${origin}/register?ref=${encodeURIComponent(code)}` : "";
  const tradeTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const reward of tradeRewards) {
      totals.set(reward.currency, (totals.get(reward.currency) ?? 0) + Number(reward.amount));
    }
    return [...totals.entries()];
  }, [tradeRewards]);

  async function copyLink() {
    if (!code) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Refer & earn</h1>
          <Sparkles className="h-5 w-5 text-emerald-400" />
        </div>
        <p className="mt-1.5 text-sm text-slate-400">Invite people to Pickar and earn when they join and complete trades.</p>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-[#0b0f0e] to-[#0b0f0e] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Your referral link</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Give friends a reason to trade with Pickar.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">You earn <strong className="text-white">₦1,000</strong> for every person who signs up with your code, plus a <strong className="text-white">1% commission</strong> when their completed trades are processed.</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3.5 py-3"><Link2 className="h-4 w-4 shrink-0 text-emerald-400" /><span className="truncate text-sm text-slate-300">{shareUrl || "Your referral link will appear here"}</span></div>
            <button onClick={copyLink} disabled={!code} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy link"}</button>
          </div>
          <p className="mt-3 text-xs text-slate-500">Code: <span className="font-semibold tracking-wider text-slate-300">{code || "Available after the affiliate migration is applied"}</span></p>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={<Users className="h-4 w-4" />} label="Referred signups" value={signups.length.toLocaleString()} />
        <Stat icon={<Gift className="h-4 w-4" />} label="Signup earnings" value={formatMoney(signupEarnings, "NGN")} />
        <Stat icon={<Wallet className="h-4 w-4" />} label="Trade commissions" value={tradeRewards.length.toLocaleString()} />
      </div>

      {tradeTotals.length > 0 && <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"><p className="text-xs text-slate-500">Trade commission totals</p><div className="mt-3 flex flex-wrap gap-2">{tradeTotals.map(([currency, amount]) => <span key={currency} className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300">{formatMoney(amount, currency)}</span>)}</div></div>}

      <section className="rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4"><div><h2 className="font-semibold text-white">Reward activity</h2><p className="mt-1 text-xs text-slate-500">Your referral rewards appear here after each qualifying event.</p></div><span className="text-xs text-slate-500">{rewards.length} total</span></div>
        {rewards.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">Share your link to start earning.</div> : <ul className="divide-y divide-white/5">{rewards.slice(0, 10).map((reward) => <li key={reward.id} className="flex items-center gap-3 px-5 py-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">{reward.reward_type === "signup" ? <Users className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm text-white">{reward.reward_type === "signup" ? "New signup" : "Completed trade"}</p><p className="mt-0.5 truncate text-xs text-slate-500">{reward.description} · {formatDate(reward.created_at)}</p></div><span className="shrink-0 text-sm font-semibold text-emerald-400">+{formatMoney(Number(reward.amount), reward.currency)}</span></li>)}</ul>}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">{icon}</span><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-white">{value}</p></div>;
}

function formatMoney(amount: number, currency: string) {
  try { return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount); } catch { return `${currency} ${amount.toLocaleString()}`; }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
