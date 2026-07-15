import { ShieldCheck, Headset, Lock } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Bank-level encryption",
    desc: "Your card and wallet details are encrypted before they're stored.",
  },
  {
    icon: Headset,
    title: "Real human support",
    desc: "Talk to the Pickar team directly — never an automated bot.",
  },
  {
    icon: Lock,
    title: "Private by design",
    desc: "Only you and support can ever see your account and chats.",
  },
];

export default function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      {ITEMS.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5"
        >
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Icon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold">{title}</p>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
