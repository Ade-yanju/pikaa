import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { CompanyAccount } from "@/lib/types";
import AccountCreateForm from "./AccountCreateForm";
import ToggleButton from "./ToggleButton";
import DeleteAccountButton from "./DeleteAccountButton";

export const metadata = { title: "Company Accounts — Pickar Support" };

export default async function AccountsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("company_accounts")
    .select("*")
    .order("created_at", { ascending: false });

  const accounts = (data as CompanyAccount[]) ?? [];

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div className="space-y-4 order-2 lg:order-1">
        <h1 className="text-xl font-bold text-white">Company receiving accounts</h1>
        <p className="text-sm text-slate-400">
          These are the accounts support shares with freelancers to collect their
          payouts. They&apos;re never exposed publicly — only shared per request.
        </p>

        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-slate-400">
            No accounts yet. Add one on the right.
          </div>
        ) : (
          <ul className="space-y-3">
            {accounts.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">
                      {a.label}{" "}
                      <span className="text-slate-500 font-normal">· {a.currency}</span>
                    </p>
                    {a.region && (
                      <p className="text-xs text-slate-500">{a.region}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <ToggleButton id={a.id} active={a.is_active} />
                    <DeleteAccountButton id={a.id} label={a.label} />
                  </div>
                </div>
                <dl className="grid grid-cols-[130px_1fr] gap-y-1 text-sm text-slate-300 mt-3">
                  <Detail k="Account name" v={a.account_name} />
                  <Detail k="Bank" v={a.bank_name} />
                  <Detail k="Account no." v={a.account_number} />
                  <Detail k="Routing/IBAN" v={a.routing_number} />
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <AccountCreateForm />
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
