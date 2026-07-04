"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCompanyAccount } from "@/app/admin/actions";

export default function DeleteAccountButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">Delete “{label}”?</span>
        <button
          onClick={() => start(async () => { await deleteCompanyAccount(id); })}
          disabled={pending}
          className="text-red-400 hover:text-red-300 font-medium disabled:opacity-50"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-slate-500 hover:text-white">
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-slate-500 hover:text-red-400 transition-colors"
      aria-label="Delete account"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
