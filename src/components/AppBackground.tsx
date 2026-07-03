// Shared ambient backdrop — mirrors the landing page's premium feel:
// emerald/blue spotlights, film grain, and a masked grid. Purely decorative.
export default function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#050505]">
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-emerald-900/25 blur-[160px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[55%] h-[55%] rounded-full bg-blue-900/20 blur-[160px]" />
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.10] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
    </div>
  );
}
