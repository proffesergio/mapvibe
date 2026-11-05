"use client";

import { useEffect, useState } from "react";

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

/**
 * PWA install prompt — rendered in the footer area.
 * - Chrome/Edge/Android: captures `beforeinstallprompt`, shows native install.
 * - iOS Safari: shows Share → "Add to Home Screen" guidance.
 * - Dismiss persists to localStorage; mobile-friendly compact banner.
 */
export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem("vibemap:pwa-dismissed") === "1");
    setInstalled(isStandalone());
    setIosHint(isIos() && !isStandalone());
    const onBefore = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBefore);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;
  // Nothing to offer on desktop browsers without prompt and without iOS hint.
  if (!deferred && !iosHint) return null;

  const dismiss = () => {
    localStorage.setItem("vibemap:pwa-dismissed", "1");
    setDismissed(true);
  };

  const install = async () => {
    if (!deferred) return;
    setBusy(true);
    try {
      deferred.prompt();
      await deferred.userChoice;
    } finally {
      setBusy(false);
      setDeferred(null);
    }
  };

  return (
    <div
      role="region"
      aria-label="অ্যাপ ইনস্টল করুন"
      className="mx-auto mt-5 w-full max-w-5xl px-4"
    >
      <div className="flex flex-col gap-3 rounded-3xl border border-indigo-200 bg-indigo-50 p-4 text-left sm:flex-row sm:items-center dark:border-indigo-400/25 dark:bg-indigo-400/10">
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white">
          📲
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-900 sm:text-base dark:text-white">
            ভাইবম্যাপ অ্যাপ হিসেবে ইনস্টল করুন
          </p>
          <p className="mt-0.5 text-xs leading-5 text-slate-600 sm:text-sm dark:text-slate-300">
            {iosHint
              ? "iPhone-এ Safari-এর Share ⬆️ → “Add to Home Screen” চাপুন।"
              : "হোম স্ক্রিনে রাখুন — ১ ট্যাপে ম্যাপ পোস্টার বানান, অফলাইনেও খুলবে।"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!iosHint && deferred && (
            <button
              type="button"
              onClick={install}
              disabled={busy}
              className="h-11 cursor-pointer rounded-2xl bg-indigo-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-60"
            >
              {busy ? "⏳…" : "⬇️ ইনস্টল"}
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="বন্ধ করুন"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-100 active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
