"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Plus, ImagePlus, Lock, X } from "lucide-react";
import { createGiftCardTrade } from "@/app/dashboard/trade-actions";

const BRANDS = [
  "Amazon", "Apple", "iTunes", "Steam", "Google Play", "Razer Gold",
  "eBay", "Sephora", "Nordstrom", "Walmart", "Visa", "American Express", "Other",
];
const CURRENCIES = ["USD", "GBP", "EUR", "CAD", "AUD"];

export default function NewGiftCardForm() {
  const [state, action, pending] = useActionState(createGiftCardTrade, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      formRef.current?.reset();
      setImageUrl("");
    }
  }, [state]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImgError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) setImgError(data.error ?? "Upload failed.");
      else setImageUrl(data.url);
    } catch {
      setImgError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4"
    >
      <h2 className="text-white font-semibold">Sell a gift card</h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">Brand</span>
          <select name="asset" defaultValue="Amazon" className={inputCls}>
            {BRANDS.map((b) => (
              <option key={b} value={b} className="bg-[#0b0f0e]">{b}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Type</span>
          <select name="network" defaultValue="E-code" className={inputCls}>
            <option value="E-code" className="bg-[#0b0f0e]">E-code</option>
            <option value="Physical" className="bg-[#0b0f0e]">Physical</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">Currency</span>
          <select name="currency" defaultValue="USD" className={inputCls}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-[#0b0f0e]">{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Card value</span>
          <input name="amount" type="number" step="0.01" min="0" placeholder="100" required className={inputCls} />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-300 flex items-center gap-1.5">
          Card code / PIN (optional) <Lock className="w-3 h-3 text-emerald-400" />
        </span>
        <input name="secret" placeholder="Encrypted before storage" className={inputCls} />
        <span className="text-[11px] text-slate-500 mt-1 block">
          Encrypted at rest — only support can decrypt it to process your trade.
        </span>
      </label>

      {/* Optional card photo */}
      <input type="hidden" name="image_url" value={imageUrl} />
      <div className="flex items-center gap-3">
        <input id="gc-img" type="file" accept="image/*" onChange={onPick} className="hidden" />
        <label
          htmlFor="gc-img"
          className="flex items-center gap-2 text-sm text-slate-300 border border-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/5"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {imageUrl ? "Change photo" : "Add card photo"}
        </label>
        {imageUrl && (
          <span className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="card" className="h-10 w-16 object-cover rounded border border-white/10" />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute -top-2 -right-2 bg-black/80 rounded-full p-0.5 text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
      {imgError && <p className="text-xs text-red-400">{imgError}</p>}

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state && "ok" in state && state.ok && (
        <p className="text-sm text-emerald-400">Submitted — support will quote you in chat.</p>
      )}

      <button
        type="submit"
        disabled={pending || uploading}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold rounded-xl px-4 py-3 transition-colors"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Submit gift card</>}
      </button>
    </form>
  );
}

const inputCls =
  "mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/60 transition-colors";
