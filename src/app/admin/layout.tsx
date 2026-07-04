import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { logout } from "@/app/(auth)/actions";
import AppBackground from "@/components/AppBackground";
import SideNav from "@/components/SideNav";
import MessageNotifier from "@/components/MessageNotifier";
import PushSetup from "@/components/PushSetup";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <AppBackground />
      <MessageNotifier currentUserId={admin.id} role="admin" />
      <PushSetup />

      <header className="border-b border-white/10 bg-[#070909]/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white font-bold text-xl tracking-tighter">
              Pickar<span className="text-emerald-400">.</span>
            </Link>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
              Support Console
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden sm:inline">Switch to User View</span>
            </Link>
            <form action={logout}>
              <button className="text-sm text-slate-400 hover:text-white transition-colors border-l border-white/10 pl-4">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-5 py-7 flex gap-7 pb-24 md:pb-7">
        <SideNav variant="admin" />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
