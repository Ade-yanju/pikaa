import Link from "next/link";
import { ArrowRight, Check, Gift, ShieldCheck, TrendingUp, Users } from "lucide-react";

export const metadata = {
  title: "Pickar Affiliates — Refer & Earn",
  description: "Invite people to Pickar and earn signup rewards and trade commissions.",
};

export default function AffiliatesPage() {
  return (
    <div className="px-6 py-14 sm:py-20">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 via-[#0b0f0e] to-[#050505] px-6 py-12 sm:px-12 sm:py-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300"><Gift className="h-3.5 w-3.5" /> Pickar Affiliate Program</span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">Share Pickar. <span className="text-emerald-400">Earn together.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Invite friends, clients, and your community to trade with Pickar. You receive ₦1,000 for each new signup through your code, plus a 1% commission on their completed trades.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 font-semibold text-black transition-colors hover:bg-emerald-300">Join the affiliate program <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3.5 font-medium text-slate-200 transition-colors hover:bg-white/5">Already have an account?</Link></div>
          <p className="mt-4 text-xs text-slate-500">There is no separate affiliate account. Your normal Pickar account includes your affiliate link.</p>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl"><div className="grid gap-4 md:grid-cols-3"><Benefit icon={<Users className="h-5 w-5" />} title="Create your link" text="Register or log in, then open Refer & Earn to find your personal referral link." /><Benefit icon={<Gift className="h-5 w-5" />} title="Earn ₦1,000" text="When someone creates a Pickar account using your referral code, the signup reward is added to your earnings." /><Benefit icon={<TrendingUp className="h-5 w-5" />} title="Earn on trades" text="Receive a 1% commission when a person you referred completes a qualifying trade." /></div></section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px] lg:items-start"><div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"><h2 className="text-xl font-semibold text-white">How it works</h2><ol className="mt-6 space-y-5">{["Create your free Pickar account.", "Open Refer & Earn and copy your personal link.", "Share your link with your network.", "Track signup rewards and trade commissions from your dashboard."].map((step, index) => <li key={step} className="flex gap-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-400">{index + 1}</span><span className="pt-1 text-sm text-slate-300">{step}</span></li>)}</ol></div><div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6"><ShieldCheck className="h-6 w-6 text-emerald-400" /><h2 className="mt-4 font-semibold text-white">Simple and transparent</h2><p className="mt-2 text-sm leading-6 text-slate-400">Rewards are recorded after the qualifying signup or completed trade and appear in your affiliate activity.</p><div className="mt-5 space-y-2 text-xs text-slate-300"><p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" /> ₦1,000 per referred signup</p><p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" /> 1% per completed referred trade</p></div></div></section>
    </div>
  );
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">{icon}</span><h2 className="mt-4 font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>;
}
