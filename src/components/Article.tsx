export default function Article({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="text-slate-400 mt-3">{subtitle}</p>}
      {updated && (
        <p className="text-sm text-slate-500 mt-2">Last updated: {updated}</p>
      )}
      <div
        className="mt-8 space-y-5 leading-relaxed
          [&_h2]:text-white [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-1 [&_h2]:scroll-mt-24
          [&_p]:text-slate-400
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:text-slate-400
          [&_a]:text-emerald-400 [&_a:hover]:text-emerald-300
          [&_strong]:text-slate-200"
      >
        {children}
      </div>
    </div>
  );
}
