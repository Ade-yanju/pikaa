import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { WHATSAPP_CHANNEL_URL } from "@/lib/constants";
import { logout } from "@/app/(auth)/actions";
import AppBackground from "@/components/AppBackground";
import SideNav from "@/components/SideNav";
import MessageNotifier from "@/components/MessageNotifier";
import PushSetup from "@/components/PushSetup";
import InstallPrompt from "@/components/InstallPrompt";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireUser();
  const initial = (profile.full_name || profile.email || "U")
    .charAt(0)
    .toUpperCase();

  const supabase = await createClient();
  const { data: conv } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <AppBackground />
      <MessageNotifier
        currentUserId={profile.id}
        surface="user"
        ownConversationId={conv?.id ?? null}
      />
      <PushSetup />
      <InstallPrompt />

      <header className="border-b border-white/10 bg-[#070909]/70 backdrop-blur-xl sticky top-0 z-40 pt-safe px-safe">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl tracking-tighter">
            Pickar<span className="text-emerald-400">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#25D366] hover:opacity-80 transition-opacity"
              title="Join our WhatsApp channel"
            >
              <SiWhatsapp className="w-4 h-4" />
              <span className="hidden sm:inline">Channel</span>
            </a>
            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span className="hidden sm:inline">Switch to Admin</span>
              </Link>
            )}
            <div className="flex items-center gap-2.5 pl-4 border-l border-white/10">
              <Link
                href="/dashboard/settings"
                title="Edit your profile"
                className="flex items-center gap-2.5 group"
              >
                <span className="grid place-items-center w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 text-sm font-semibold group-hover:bg-emerald-500/25 transition-colors">
                  {initial}
                </span>
                <div className="hidden sm:block leading-tight">
                  <p className="text-white text-sm font-medium group-hover:text-emerald-300 transition-colors">
                    {profile.full_name || "Freelancer"}
                  </p>
                  <p className="text-[11px] text-slate-500">{profile.email}</p>
                </div>
              </Link>
              <form action={logout}>
                <button className="ml-1 text-sm text-slate-400 hover:text-white transition-colors">
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-5 py-7 flex gap-7 pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:pb-7">
        <SideNav variant="user" />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
