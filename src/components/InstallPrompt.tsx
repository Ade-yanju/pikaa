"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// Shows a native "Install app" prompt when the browser reports the PWA is
// installable (Android/desktop Chrome/Edge). On click it triggers the real
// OS install dialog. iOS install guidance is handled by PushSetup.
export default function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS-only Safari flag
      window.navigator.standalone === true;
    if (standalone || localStorage.getItem("pk_install_dismiss") === "1") {
      setHidden(true);
      return;
    }
    const onBIP = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setEvt(null);
      setHidden(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") setHidden(true);
    setEvt(null);
  }

  function dismiss() {
    localStorage.setItem("pk_install_dismiss", "1");
    setHidden(true);
  }

  if (hidden || !evt) return null;

  return (
    <div className="fixed bottom-[calc(10.5rem_+_env(safe-area-inset-bottom))] md:bottom-20 left-1/2 -translate-x-1/2 z-[56] w-[min(94vw,420px)]">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-[#0b0f0e]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/50">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
          <Download className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">Install the Pickar app</p>
          <p className="text-slate-400 text-xs">
            Add it to your device for faster, full-screen access.
          </p>
        </div>
        <button
          onClick={install}
          className="text-xs font-semibold text-black bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 rounded-lg shrink-0"
        >
          Install
        </button>
        <button
          onClick={dismiss}
          className="text-slate-500 hover:text-white shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
