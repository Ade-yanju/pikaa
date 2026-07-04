import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { Trade } from "@/lib/types";
import UserTradeList from "@/components/UserTradeList";
import NewCryptoForm from "./NewCryptoForm";

export const metadata = { title: "Trade Crypto — Pickar" };

export default async function CryptoPage() {
  await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("trades")
    .select("*")
    .eq("type", "crypto")
    .order("created_at", { ascending: false });

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div className="space-y-4 order-2 lg:order-1">
        <h1 className="text-xl font-bold text-white">Your crypto trades</h1>
        <UserTradeList
          trades={(data as Trade[]) ?? []}
          emptyText="No crypto trades yet."
        />
      </div>
      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <NewCryptoForm />
      </div>
    </div>
  );
}
