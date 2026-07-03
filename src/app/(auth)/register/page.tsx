import type { Metadata } from "next";
import AuthForm from "../_components/AuthForm";

export const metadata: Metadata = { title: "Create account — Pickar" };

export default function RegisterPage() {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/15 to-white/[0.03] shadow-2xl shadow-black/40">
      <div className="rounded-2xl bg-[#0b0f0e]/80 backdrop-blur-xl p-8">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-sm text-slate-400 mt-1 mb-6">
          Register to chat with support and request your payment details.
        </p>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
