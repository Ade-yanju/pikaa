import type { Metadata } from "next";
import { PhoneCall, Mail, MessageSquare } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import {
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  WHATSAPP_SUPPORT_URL,
  WHATSAPP_CHANNEL_URL,
} from "@/lib/constants";

export const metadata: Metadata = { title: "Contact — Pickar" };

export default function ContactPage() {
  const cards = [
    {
      icon: <SiWhatsapp className="w-5 h-5" />,
      title: "WhatsApp support",
      desc: "Fastest way to reach a human.",
      action: "Chat now",
      href: WHATSAPP_SUPPORT_URL,
      external: true,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "In-app support chat",
      desc: "Log in and message our team directly.",
      action: "Open dashboard",
      href: "/dashboard/chat",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      desc: SUPPORT_EMAIL,
      action: "Send email",
      href: `mailto:${SUPPORT_EMAIL}`,
      external: true,
    },
    {
      icon: <PhoneCall className="w-5 h-5" />,
      title: "Phone",
      desc: SUPPORT_PHONE,
      action: "Call us",
      href: `tel:${SUPPORT_PHONE}`,
      external: true,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        Contact us
      </h1>
      <p className="text-slate-400 mt-3">
        We&apos;re here to help with payouts, gift cards, crypto and anything in
        between.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noreferrer" : undefined}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/40 p-5 transition-colors"
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
              {c.icon}
            </span>
            <h2 className="text-white font-semibold mt-3">{c.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{c.desc}</p>
            <span className="inline-block text-sm text-emerald-400 mt-3 group-hover:translate-x-0.5 transition-transform">
              {c.action} →
            </span>
          </a>
        ))}
      </div>

      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-[#25D366] hover:opacity-80"
      >
        <SiWhatsapp className="w-4 h-4" /> Follow our WhatsApp channel for updates
      </a>
    </div>
  );
}
