"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck, Loader2 } from "lucide-react";
import {
  requestRegister,
  requestLogin,
  verifyOtp,
  resendOtp,
  type AuthState,
} from "../actions";
import { COUNTRIES } from "@/lib/countries";

const initial: AuthState = {};

export default function AuthForm({
  mode,
  next,
}: {
  mode: "register" | "login";
  next?: string;
}) {
  const requestAction = mode === "register" ? requestRegister : requestLogin;
  const [reqState, submitRequest, reqPending] = useActionState(
    requestAction,
    initial,
  );
  const [verState, submitVerify, verPending] = useActionState(
    verifyOtp,
    initial,
  );
  const [resendState, submitResend, resendPending] = useActionState(
    resendOtp,
    initial,
  );

  const email = verState.email || resendState.email || reqState.email || "";
  const sent = reqState.sent || verState.sent || resendState.sent;
  const otpRef = useRef<HTMLInputElement>(null);

  const [countryCode, setCountryCode] = useState("US");
  const [phoneLocal, setPhoneLocal] = useState("");
  const country =
    COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];

  useEffect(() => {
    if (sent) otpRef.current?.focus();
  }, [sent]);

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-400">
          <div className="grid place-items-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white font-semibold">Check your email</p>
            <p className="text-sm text-slate-400">
              We sent a 6-digit code to {email}
            </p>
          </div>
        </div>

        <form action={submitVerify} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <input
            ref={otpRef}
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="••••••"
            className="w-full text-center tracking-[0.5em] text-2xl font-semibold bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition-all"
          />
          {verState.error ? (
            <p className="text-sm text-red-400">{verState.error}</p>
          ) : null}
          <SubmitButton pending={verPending} label="Verify & continue" />
        </form>

        <div className="flex items-center justify-between text-sm">
          <form action={submitResend}>
            <input type="hidden" name="email" value={email} />
            <button
              type="submit"
              disabled={resendPending}
              className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {resendPending ? "Sending…" : "Resend code"}
            </button>
          </form>
          <a href="" className="text-slate-500 hover:text-white transition-colors">
            Wrong email? Reload
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={submitRequest} className="space-y-4">
      {mode === "register" && (
        <>
          <Field name="full_name" label="Full name" placeholder="Jane Doe" required />

          {/* Country dropdown — sets the phone dial code too */}
          <label className="block">
            <span className="text-sm text-slate-300">Country</span>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0b0f0e]">
                  {c.flag} {c.name} ({c.dial})
                </option>
              ))}
            </select>
          </label>

          {/* Phone with the selected country's dial code prefixed */}
          <label className="block">
            <span className="text-sm text-slate-300">Phone (optional)</span>
            <div className="mt-1.5 flex rounded-xl border border-white/10 bg-white/5 focus-within:border-emerald-500/60 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all overflow-hidden">
              <span className="flex items-center gap-1.5 px-3 text-slate-300 bg-white/[0.04] border-r border-white/10 select-none">
                <span>{country.flag}</span>
                <span className="text-sm">{country.dial}</span>
              </span>
              <input
                inputMode="tel"
                value={phoneLocal}
                onChange={(e) =>
                  setPhoneLocal(e.target.value.replace(/[^\d\s-]/g, ""))
                }
                placeholder="801 234 5678"
                className="flex-1 bg-transparent px-3 py-3 text-white placeholder:text-slate-600 outline-none"
              />
            </div>
          </label>

          {/* Hidden fields actually submitted to the server action */}
          <input type="hidden" name="country" value={country.name} />
          <input
            type="hidden"
            name="phone"
            value={phoneLocal.trim() ? `${country.dial} ${phoneLocal.trim()}` : ""}
          />
        </>
      )}
      <Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@email.com"
        required
      />

      {reqState.error ? (
        <p className="text-sm text-red-400">{reqState.error}</p>
      ) : null}

      <SubmitButton
        pending={reqPending}
        label={mode === "register" ? "Create account" : "Send login code"}
      />

      <p className="text-center text-sm text-slate-400 pt-2">
        {mode === "register" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to Pickar?{" "}
            <Link
              href="/register"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Create an account
            </Link>
          </>
        )}
      </p>

      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5" /> Passwordless & encrypted
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition-all"
      />
    </label>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-60 text-black font-semibold rounded-xl px-4 py-3.5 shadow-[0_8px_30px_-8px_rgba(16,185,129,0.6)] transition-all"
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {label} <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
