import { Banknote, Lock } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { decryptSecret } from "@/lib/crypto";
import { WITHDRAWAL_METHOD_LABELS, type WithdrawalDetail } from "@/lib/types";

export const metadata = { title: "Withdrawals — Pickar Support" };

type Row = WithdrawalDetail & {
  profiles: { full_name: string | null; email: string | null } | null;
};

export default async function AdminWithdrawalsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("withdrawal_details")
    .select("*, profiles:user_id(full_name, email)")
    .order("created_at", { ascending: false });

  const rows = (data as unknown as Row[]) ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Withdrawal details</h1>
        <p className="text-sm text-slate-400 mt-1">
          Payout accounts submitted by freelancers. Decrypted here for support only.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-500 text-sm">No withdrawal details submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((w) => {
            const acct = decryptSecret(w.account_number_enc);
            const routing = decryptSecret(w.routing_enc);
            return (
              <li key={w.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Banknote className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-white font-semibold">
                        {w.profiles?.full_name || w.profiles?.email || "Unknown user"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {WITHDRAWAL_METHOD_LABELS[w.method]}
                        {w.label ? ` · ${w.label}` : ""}
                        {w.currency ? ` · ${w.currency}` : ""} ·{" "}
                        {new Date(w.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400/80 shrink-0">
                    <Lock className="w-3 h-3" /> decrypted
                  </span>
                </div>

                <dl className="grid grid-cols-[130px_1fr] gap-y-1 text-sm text-slate-300 mt-3">
                  <Detail k="Account name" v={w.account_name} />
                  <Detail k="Bank / provider" v={w.bank_name} />
                  <Detail k="Account / wallet" v={acct} mono />
                  <Detail k="Routing/IBAN/tag" v={routing} mono />
                  <Detail k="Note" v={w.extra} />
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Detail({ k, v, mono }: { k: string; v: string | null; mono?: boolean }) {
  if (!v) return null;
  return (
    <>
      <dt className="text-slate-500">{k}</dt>
      <dd className={`text-white break-all ${mono ? "font-mono select-all" : "font-medium"}`}>
        {v}
      </dd>
    </>
  );
}
