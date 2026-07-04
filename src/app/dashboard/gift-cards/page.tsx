import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { Trade } from "@/lib/types";
import UserTradeList from "@/components/UserTradeList";
import NewGiftCardForm from "./NewGiftCardForm";

export const metadata = { title: "Sell Gift Card — Pickar" };

export default async function GiftCardsPage() {
  await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("trades")
    .select("*")
    .eq("type", "gift_card")
    .order("created_at", { ascending: false });

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div className="space-y-4 order-2 lg:order-1">
        <h1 className="text-xl font-bold text-white">Your gift card sales</h1>
        <UserTradeList
          trades={(data as Trade[]) ?? []}
          emptyText="No gift cards submitted yet."
        />
      </div>
      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <NewGiftCardForm />
      </div>
    </div>
  );
}
