import Link from "next/link";
import { PhoneCall, Mail } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import {
  WHATSAPP_CHANNEL_URL,
  WHATSAPP_SUPPORT_URL,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
} from "@/lib/constants";

const YEAR = new Date().getFullYear();

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Global payouts", href: "/register" },
      { label: "Sell gift cards", href: "/register" },
      { label: "Trade crypto", href: "/register" },
      { label: "Secure escrow", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "AML & KYC", href: "/terms#aml" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030303] relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="text-white font-bold text-2xl tracking-tighter">
              Pickar<span className="text-emerald-400">.</span>
            </Link>
            <p className="text-slate-500 text-sm mt-4 max-w-xs leading-relaxed">
              The secure bridge for global work — get paid anywhere, exchange gift
              cards, and trade crypto with a team that has your back.
            </p>
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-[#25D366] border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 px-3.5 py-2 rounded-full transition-colors"
            >
              <SiWhatsapp className="w-4 h-4" /> Join our WhatsApp channel
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-white text-sm font-semibold mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/5 text-sm text-slate-500">
          <a href={`tel:${SUPPORT_PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors">
            <PhoneCall className="w-4 h-4" /> {SUPPORT_PHONE}
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail className="w-4 h-4" /> {SUPPORT_EMAIL}
          </a>
          <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
            <SiWhatsapp className="w-4 h-4" /> Chat on WhatsApp
          </a>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 text-xs text-slate-600">
          <p>© {YEAR} Pickar. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/careers" className="hover:text-slate-300">Careers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
