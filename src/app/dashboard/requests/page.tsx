import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import {
  PAYMENT_STATUS_LABELS,
  type CompanyAccount,
  type PaymentRequest,
} from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import NewRequestForm from "./NewRequestForm";

export const metadata = { title: "Payment Requests — Pickar" };

export default async function RequestsPage() {
  const profile = await requireUser();
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("payment_requests")
    .select("*, company_accounts(*)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const rows = (requests as (PaymentRequest & {
    company_accounts: CompanyAccount | null;
  })[]) ?? [];

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div className="space-y-4 order-2 lg:order-1">
        <h1 className="text-xl font-bold text-white">Your requests</h1>
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="text-slate-400 text-sm">
              You haven&apos;t requested any payment details yet.
            </p>
          </div>
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
                      {r.client_name ? `Client: ${r.client_name} · ` : ""}
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge
                    status={r.status}
                    label={PAYMENT_STATUS_LABELS[r.status]}
                  />
                </div>

                {r.purpose && (
                  <p className="text-sm text-slate-400 mt-2">{r.purpose}</p>
                )}

                {r.admin_note && (
                  <p className="text-sm text-slate-300 mt-2 border-l-2 border-emerald-500/40 pl-3">
                    {r.admin_note}
                  </p>
                )}

                {/* When support shares an account, show the details here too. */}
                {r.company_accounts && (
                  <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm">
                    <p className="text-emerald-400 font-semibold mb-2">
                      Payment details shared
                    </p>
                    <dl className="grid grid-cols-[130px_1fr] gap-y-1 text-slate-300">
                      <Detail k="Account name" v={r.company_accounts.account_name} />
                      <Detail k="Bank" v={r.company_accounts.bank_name} />
                      <Detail k="Account no." v={r.company_accounts.account_number} />
                      <Detail k="Routing/IBAN" v={r.company_accounts.routing_number} />
                      <Detail k="Currency" v={r.company_accounts.currency} />
                    </dl>
                  </div>
                )}

                <Link
                  href="/dashboard/chat"
                  className="inline-block text-xs text-emerald-400 hover:text-emerald-300 mt-3"
                >
                  Discuss in chat →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <NewRequestForm />
      </div>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string | null }) {
  if (!v) return null;
  return (
    <>
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-white font-medium break-all">{v}</dd>
    </>
  );
}
