import Link from "next/link";
import { ArrowRight, MessagesSquare, Wallet, Clock, CheckCircle2, Gift, Bitcoin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { requireUser } from "@/lib/dal";
import { WHATSAPP_CHANNEL_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { PAYMENT_STATUS_LABELS, type PaymentRequest } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

export default async function DashboardHome() {
  const profile = await requireUser();
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const all = (requests as PaymentRequest[]) ?? [];
  const recent = all.slice(0, 4);
  const pending = all.filter((r) => ["pending", "in_review"].includes(r.status)).length;
  const completed = all.filter((r) => ["details_shared", "completed"].includes(r.status)).length;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1.5">
          Request your company payment details and our team will get you paid.
        </p>
      </div>

      {/* WhatsApp channel */}
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/[0.07] hover:bg-[#25D366]/[0.12] p-4 transition-colors"
      >
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#25D366]/15 text-[#25D366] shrink-0">
          <SiWhatsapp className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">Join our WhatsApp channel</p>
          <p className="text-slate-400 text-xs">
            Live rates, payout updates and announcements — straight to your phone.
          </p>
        </div>
        <span className="text-sm font-semibold text-[#25D366] flex items-center gap-1 group-hover:gap-2 transition-all">
          Join <ArrowRight className="w-4 h-4" />
        </span>
      </a>

      {/* stat row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Stat label="Total requests" value={all.length} icon={<Wallet className="w-4 h-4" />} />
        <Stat label="Awaiting support" value={pending} icon={<Clock className="w-4 h-4" />} accent="amber" />
        <Stat label="Fulfilled" value={completed} icon={<CheckCircle2 className="w-4 h-4" />} accent="emerald" />
      </div>

      {/* actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <ActionCard
          href="/dashboard/requests"
          icon={<Wallet className="w-6 h-6 text-emerald-400" />}
          title="Request payment details"
          desc="Tell us the amount and currency; support shares the account to receive your payout."
          cta="New request"
          primary
        />
        <ActionCard
          href="/dashboard/chat"
          icon={<MessagesSquare className="w-6 h-6 text-slate-200" />}
          title="Chat with support"
          desc="Talk to the Pickar team in real time about your payments."
          cta="Open chat"
        />
        <ActionCard
          href="/dashboard/gift-cards"
          icon={<Gift className="w-6 h-6 text-slate-200" />}
          title="Sell a gift card"
          desc="Trade Amazon, Apple, Steam and more for cash. Card details are encrypted."
          cta="Sell gift card"
        />
        <ActionCard
          href="/dashboard/crypto"
          icon={<Bitcoin className="w-6 h-6 text-slate-200" />}
          title="Trade cryptocurrency"
          desc="Buy or sell BTC, ETH, USDT and more with support. Wallet details are encrypted."
          cta="Trade crypto"
        />
      </div>

      {/* recent */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent requests</h2>
          <Link href="/dashboard/requests" className="text-xs text-emerald-400 hover:text-emerald-300">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-sm text-slate-500 mt-3">
              No requests yet.{" "}
              <Link href="/dashboard/requests" className="text-emerald-400">
                Create your first one
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white text-sm font-medium">
                    {r.currency} {r.amount ?? ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {r.client_name ? `Client: ${r.client_name} · ` : ""}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={r.status} label={PAYMENT_STATUS_LABELS[r.status]} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  accent = "slate",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: "slate" | "amber" | "emerald";
}) {
  const color =
    accent === "amber"
      ? "text-amber-400"
      : accent === "emerald"
        ? "text-emerald-400"
        : "text-slate-300";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className={`flex items-center gap-1.5 text-xs text-slate-500`}>
        <span className={color}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  desc,
  cta,
  primary,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group rounded-2xl border p-6 transition-all",
        primary
          ? "border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 to-transparent hover:border-emerald-500/50 hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.5)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/25",
      ].join(" ")}
    >
      {icon}
      <h2 className="text-white font-semibold mt-3">{title}</h2>
      <p className="text-sm text-slate-400 mt-1">{desc}</p>
      <span
        className={`inline-flex items-center gap-1 text-sm mt-4 group-hover:gap-2 transition-all ${primary ? "text-emerald-400" : "text-slate-200"}`}
      >
        {cta} <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
