"use client";

import { useEffect } from "react";

/** Registers /sw.js once (PWA offline shell). Safe no-op when unsupported. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.hostname === "localhost") return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
