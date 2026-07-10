"use client";

import { useEffect, useState } from "react";
import { Bell, X, Share } from "lucide-react";

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function subscribe(): Promise<boolean> {
  if (!VAPID) return false;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID),
  });
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub.toJSON()),
  });
  return res.ok;
}

export default function PushSetup() {
  const [mode, setMode] = useState<"hidden" | "enable" | "ios">("hidden");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});

    const dismissed = localStorage.getItem("pk_push_dismiss") === "1";
    const supported = "serviceWorker" in navigator && "PushManager" in window;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS-only
      window.navigator.standalone === true;

    if (supported && Notification.permission === "granted") {
      subscribe().catch(() => {}); // keep server in sync silently
      return;
    }
    if (dismissed) return;
    if (supported && Notification.permission === "default") {
      setMode("enable");
    } else if (isIOS && !standalone) {
      setMode("ios");
    }
  }, []);

  function dismiss() {
    localStorage.setItem("pk_push_dismiss", "1");
    setMode("hidden");
  }

  async function enable() {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") await subscribe();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
      setMode("hidden");
    }
  }

  if (mode === "hidden") return null;

  return (
    <div className="fixed bottom-[calc(6rem_+_env(safe-area-inset-bottom))] md:bottom-5 left-1/2 -translate-x-1/2 z-[55] w-[min(94vw,420px)]">
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-[#0b0f0e]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/50">
        <span className="grid place-items-center w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
          <Bell className="w-4 h-4" />
        </span>
        <div className="flex-1 min-w-0">
          {mode === "enable" ? (
            <>
              <p className="text-white text-sm font-semibold">Turn on notifications</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Get alerted the moment support or a freelancer messages you — even
                when Pickar is closed.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={enable}
                  disabled={busy}
                  className="text-xs font-semibold text-black bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 px-3.5 py-2 rounded-lg"
                >
                  {busy ? "Enabling…" : "Enable"}
                </button>
                <button
                  onClick={dismiss}
                  className="text-xs text-slate-400 hover:text-white px-2 py-2"
                >
                  Not now
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white text-sm font-semibold">Install to get alerts</p>
              <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1 flex-wrap">
                On iPhone, tap <Share className="w-3.5 h-3.5 inline" /> Share →
                <span className="text-slate-200">Add to Home Screen</span>, then open
                Pickar from your home screen to enable push.
              </p>
              <button
                onClick={dismiss}
                className="text-xs text-emerald-400 hover:text-emerald-300 mt-2"
              >
                Got it
              </button>
            </>
          )}
        </div>
        <button
          onClick={dismiss}
          className="text-slate-500 hover:text-white shrink-0"
          aria-label="dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
