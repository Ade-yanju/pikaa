"use client";

import { useActionState } from "react";
import { Loader2, Check } from "lucide-react";
import { updateProfile } from "@/app/dashboard/actions";
import type { Profile } from "@/lib/types";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, {});

  return (
    <form
      action={action}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 max-w-lg"
    >
      <Field
        name="full_name"
        label="Full name"
        defaultValue={profile.full_name ?? ""}
        placeholder="Jane Doe"
        required
      />
      {profile.role === "admin" && (
        <p className="text-xs text-emerald-400/80 -mt-2">
          This is the name teammates see on your replies in support chats.
        </p>
      )}
      <Field
        name="country"
        label="Country"
        defaultValue={profile.country ?? ""}
        placeholder="United States"
      />
      <Field
        name="phone"
        label="Phone"
        defaultValue={profile.phone ?? ""}
        placeholder="+1 555 000 0000"
      />

      <label className="block">
        <span className="text-sm text-slate-300">Email</span>
        <input
          value={profile.email ?? ""}
          disabled
          className="mt-1.5 w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
        />
        <span className="text-[11px] text-slate-600 mt-1 block">
          Email can&apos;t be changed.
        </span>
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state && "ok" in state && state.ok && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-400">
          <Check className="w-4 h-4" /> Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold rounded-xl px-5 py-2.5 transition-colors"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Save changes
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition-all"
      />
    </label>
  );
}
