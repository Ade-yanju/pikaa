import Link from "next/link";
import AppBackground from "@/components/AppBackground";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <AppBackground />
      <header className="border-b border-white/10 bg-[#050505]/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl tracking-tighter">
            Pickar<span className="text-emerald-400">.</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 text-sm">
            <Link href="/careers" className="hidden sm:inline text-slate-400 hover:text-white transition-colors">
              Careers
            </Link>
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/register"
              className="text-black bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-full font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
