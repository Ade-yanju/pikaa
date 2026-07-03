import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import {
  PAYMENT_STATUS_LABELS,
  type CompanyAccount,
  type PaymentRequest,
} from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import RequestManageForm from "./RequestManageForm";

export const metadata = { title: "Requests — Pickar Support" };

type Row = PaymentRequest & {
  profiles: { full_name: string | null; email: string | null } | null;
};

export default async function AdminRequestsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: requests }, { data: accounts }] = await Promise.all([
    supabase
      .from("payment_requests")
      .select("*, profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false }),
    supabase
      .from("company_accounts")
      .select("*")
      .eq("is_active", true)
      .order("currency"),
  ]);

  const rows = (requests as unknown as Row[]) ?? [];
  const accountList = (accounts as CompanyAccount[]) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Payment requests</h1>
        {accountList.length === 0 && (
          <Link
            href="/admin/accounts"
            className="text-xs text-amber-400 hover:text-amber-300"
          >
            Add a company account first →
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-500 text-sm">No requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-semibold">
                    {r.currency} {r.amount ?? ""}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {r.profiles?.full_name || r.profiles?.email || "Unknown"} ·{" "}
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                  {r.client_name && (
                    <p className="text-xs text-slate-500">Client: {r.client_name}</p>
                  )}
                  {r.purpose && (
                    <p className="text-sm text-slate-400 mt-2">{r.purpose}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge
                    status={r.status}
                    label={PAYMENT_STATUS_LABELS[r.status]}
                  />
                  {r.conversation_id && (
                    <Link
                      href={`/admin/chat/${r.conversation_id}`}
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Open chat →
                    </Link>
                  )}
                </div>
              </div>

              <RequestManageForm request={r} accounts={accountList} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
