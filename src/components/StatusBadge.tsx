import { STATUS_TONES } from "@/lib/types";

export default function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const tone =
    STATUS_TONES[status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/30";
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${tone}`}>
      {label}
    </span>
  );
}
