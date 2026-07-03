"use client";

import { useState, useTransition } from "react";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { setUserRole } from "@/app/admin/actions";

export default function RoleToggle({
  userId,
  role,
}: {
  userId: string;
  role: "admin" | "user";
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const makeAdmin = role !== "admin";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await setUserRole(userId, makeAdmin ? "admin" : "user");
            if (res?.error) setError(res.error);
          })
        }
        disabled={pending}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
          makeAdmin
            ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            : "border-white/10 text-slate-400 hover:bg-white/5"
        }`}
      >
        {pending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : makeAdmin ? (
          <ShieldCheck className="w-3.5 h-3.5" />
        ) : (
          <ShieldOff className="w-3.5 h-3.5" />
        )}
        {makeAdmin ? "Make admin" : "Revoke admin"}
      </button>
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
