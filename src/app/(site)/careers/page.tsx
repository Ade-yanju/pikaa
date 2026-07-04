import type { Metadata } from "next";
import { Palette, Headphones, LineChart, Code2, Megaphone, Globe, Rocket, HeartHandshake } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { WHATSAPP_SUPPORT_URL } from "@/lib/constants";

const applyLink = (role: string) =>
  `${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(`I am interested in this role: ${role}`)}`;

export const metadata: Metadata = { title: "Careers — Pickar" };

const ROLES = [
  {
    title: "Graphics Designer",
    icon: <Palette className="w-5 h-5" />,
    type: "Full-time · Remote",
    featured: true,
    desc: "Own Pickar's visual identity across product, social and campaigns — from marketing creatives and gift-card/crypto graphics to in-app illustration and motion. You'll turn a fast-moving fintech brand into work people stop to look at.",
    skills: ["Figma", "Brand & social design", "Illustration / motion a plus"],
  },
  {
    title: "Customer Support Specialist",
    icon: <Headphones className="w-5 h-5" />,
    type: "Full-time · Remote",
    desc: "Be the human our customers chat with — process payouts, gift cards and crypto trades quickly and kindly across time zones.",
    skills: ["Great written English", "Fintech curiosity", "Calm under pressure"],
  },
  {
    title: "Crypto Trading Analyst",
    icon: <LineChart className="w-5 h-5" />,
    type: "Full-time · Remote",
    desc: "Price trades, manage liquidity and keep our rates sharp and safe across supported assets and networks.",
    skills: ["Crypto markets", "Risk sense", "Attention to detail"],
  },
  {
    title: "Frontend Engineer",
    icon: <Code2 className="w-5 h-5" />,
    type: "Full-time · Remote",
    desc: "Build the dashboard and chat experiences with Next.js, React and Tailwind. Ship fast, keep it accessible and delightful.",
    skills: ["Next.js / React", "TypeScript", "UI craft"],
  },
  {
    title: "Social Media Manager",
    icon: <Megaphone className="w-5 h-5" />,
    type: "Contract · Remote",
    desc: "Grow our WhatsApp channel and socials with content that builds trust and community around global payments.",
    skills: ["Content strategy", "Community", "Copywriting"],
  },
];

const PERKS = [
  { icon: <Globe className="w-5 h-5" />, title: "Fully remote", desc: "Work from anywhere, on your schedule." },
  { icon: <Rocket className="w-5 h-5" />, title: "Real impact", desc: "Small team, big ownership from day one." },
  { icon: <HeartHandshake className="w-5 h-5" />, title: "People-first", desc: "We invest in your growth and wellbeing." },
];

export default function CareersPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3 py-1.5">
          We&apos;re hiring
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-5">
          Build the future of global payments
        </h1>
        <p className="text-slate-400 mt-4">
          Join a small, ambitious team making sure no border stands between
          skilled people and the money they&apos;ve earned.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {PERKS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
              {p.icon}
            </span>
            <h3 className="text-white font-semibold mt-3">{p.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mt-14 mb-4">Open roles</h2>
      <ul className="space-y-4">
        {ROLES.map((r) => (
          <li
            key={r.title}
            className={`rounded-2xl border p-6 ${
              r.featured
                ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  {r.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-lg">{r.title}</h3>
                    {r.featured && (
                      <span className="text-[11px] text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.type}</p>
                  <p className="text-sm text-slate-400 mt-2 max-w-2xl">{r.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {r.skills.map((s) => (
                      <span key={s} className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href={applyLink(r.title)}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 self-start inline-flex items-center justify-center gap-2 text-sm font-semibold text-black bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 rounded-full transition-colors"
              >
                <SiWhatsapp className="w-4 h-4" /> Apply
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-center mt-10 text-sm text-slate-500">
        Don&apos;t see your role?{" "}
        <a
          href={applyLink("General application")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
        >
          <SiWhatsapp className="w-3.5 h-3.5" /> Message us on WhatsApp
        </a>{" "}
        — we&apos;d still love to hear from you.
      </div>
    </div>
  );
}
