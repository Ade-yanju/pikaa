import type { PaymentRequestStatus } from "@/lib/types";

const STYLES: Record<PaymentRequestStatus, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  in_review: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  details_shared: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-emerald-600/15 text-emerald-300 border-emerald-500/40",
  cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

export default function StatusBadge({
  status,
  label,
}: {
  status: PaymentRequestStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-block text-xs px-2.5 py-1 rounded-full border ${STYLES[status]}`}
    >
      {label}
    </span>
  );
}
