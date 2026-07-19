"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  Wallet,
  Inbox,
  Landmark,
  Users,
  Gift,
  Bitcoin,
  ArrowLeftRight,
  Banknote,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; label: string; short: string; icon: LucideIcon };

const NAVS: Record<"user" | "admin", Item[]> = {
  user: [
    { href: "/dashboard", label: "Overview", short: "Home", icon: LayoutDashboard },
    { href: "/dashboard/chat", label: "Support Chat", short: "Chat", icon: MessagesSquare },
    { href: "/dashboard/requests", label: "Payment Requests", short: "Payments", icon: Wallet },
    { href: "/dashboard/gift-cards", label: "Sell Gift Card", short: "Gift Cards", icon: Gift },
    { href: "/dashboard/crypto", label: "Trade Crypto", short: "Crypto", icon: Bitcoin },
  ],
  admin: [
    { href: "/admin", label: "Inbox", short: "Inbox", icon: Inbox },
    { href: "/admin/requests", label: "Payment Requests", short: "Payments", icon: Wallet },
    { href: "/admin/trades", label: "Trades", short: "Trades", icon: ArrowLeftRight },
    { href: "/admin/withdrawals", label: "Withdrawals", short: "Payouts", icon: Banknote },
    { href: "/admin/accounts", label: "Company Accounts", short: "Accounts", icon: Landmark },
    { href: "/admin/team", label: "Team & Admins", short: "Team", icon: Users },
  ],
};

function useActive(items: Item[]) {
  const pathname = usePathname();
  return (href: string) => {
    const roots = ["/dashboard", "/admin"];
    if (roots.includes(href)) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);
  };
}

export default function SideNav({ variant }: { variant: "user" | "admin" }) {
  const items = NAVS[variant];
  const isActive = useActive(items);

  return (
    <>
      {/* desktop sidebar */}
      <nav className="hidden md:flex flex-col gap-1.5 w-56 shrink-0">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-emerald-500/10 text-white border border-emerald-500/30 shadow-[0_0_20px_-8px_rgba(16,185,129,0.5)]"
                  : "text-slate-400 border border-transparent hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* mobile bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#070909]/90 backdrop-blur-xl grid bottom-nav-safe px-safe"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map(({ href, short, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${active ? "text-emerald-400" : "text-slate-500"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{short}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
