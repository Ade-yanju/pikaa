"use client";

import { useTransition } from "react";
import { toggleCompanyAccount } from "@/app/admin/actions";

export default function ToggleButton({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          await toggleCompanyAccount(id, !active);
        })
      }
      disabled={pending}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50 ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
          : "bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}
