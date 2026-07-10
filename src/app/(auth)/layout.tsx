import Link from "next/link";
import { ShieldCheck, Globe, Wallet, MessagesSquare } from "lucide-react";
import AppBackground from "@/components/AppBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <AppBackground />

      <header className="px-6 h-20 flex items-center max-w-6xl mx-auto w-full pt-safe">
        <Link href="/" className="text-white font-bold text-2xl tracking-tighter">
          Pickar<span className="text-emerald-400">.</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Value panel — desktop only */}
          <aside className="hidden lg:block">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Get paid, anywhere
            </span>
            <h2 className="text-4xl font-bold text-white mt-5 leading-tight tracking-tight">
              Receive your freelance income{" "}
              <span className="text-emerald-400">from anywhere</span> in the world.
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Register, request the company payment details, and our support team
              gets your client&apos;s payment to you — fast and secure.
            </p>
            <ul className="mt-8 space-y-4">
              <Perk icon={<Wallet className="w-4 h-4" />} title="Company receiving accounts" desc="Collect payouts in USD, GBP, EUR and more." />
              <Perk icon={<MessagesSquare className="w-4 h-4" />} title="Live support chat" desc="Talk to a real person, in real time." />
              <Perk icon={<Globe className="w-4 h-4" />} title="Built for global talent" desc="No borders between you and your money." />
            </ul>
          </aside>

          <div className="w-full max-w-md mx-auto lg:mx-0">{children}</div>
        </div>
      </main>
    </div>
  );
}

function Perk({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-emerald-400 shrink-0">
        {icon}
      </span>
      <div>
        <p className="text-white text-sm font-semibold">{title}</p>
        <p className="text-slate-500 text-sm">{desc}</p>
      </div>
    </li>
  );
}
