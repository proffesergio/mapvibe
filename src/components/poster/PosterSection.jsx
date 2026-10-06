"use client";

import { useEffect, useRef, useState } from "react";
import { useStudioSnapshot } from "@/hooks/useStudioSnapshot";
import { VIRAL_NOTICE, downloadPoster } from "@/lib/download";
import { PosterCanvas } from "./PosterCanvas";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/**
 * Phase 4: live scaled preview + 1080px download + virality loop.
 * No Facebook API — download the file, then nudge wall/story posting.
 */
export function PosterSection({ tab }) {
  const snap = useStudioSnapshot();
  const wrapRef = useRef(null);
  const posterRef = useRef(null);
  const [scale, setScale] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / 1080);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const caption = `আমার ম্যাপভাইব পোস্টার! 🗺️🇧🇩 #MapVibe #বাংলাদেশ`;

  const onDownload = async () => {
    setBusy(true);
    setError("");
    setDone(false);
    try {
      await downloadPoster(posterRef.current, `mapvibe-${tab}-1080.png`);
      setDone(true);
    } catch {
      setError("ডাউনলোড ব্যর্থ — আরেকবার চেষ্টা করো।");
    } finally {
      setBusy(false);
    }
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Card>
      <SectionTitle
        emoji="⬇️"
        title="ধাপ ৪: লাইভ প্রিভিউ ও ডাউনলোড"
        desc="নিচেরটাই ১০৮০×১০৮০ ফাইনাল ছবি — ট্যাব/সিলেকশন/ছবি বদলালেই আপডেট হবে"
      />

      <div
        ref={wrapRef}
        className="w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10"
        style={scale ? { height: 1080 * scale } : undefined}
      >
        <div
          className="poster-capture"
          style={
            scale
              ? { width: 1080, height: 1080, transform: `scale(${scale})`, transformOrigin: "top left" }
              : { width: 1080, height: 1080 }
          }
        >
          <PosterCanvas tab={tab} snap={snap} innerRef={posterRef} />
        </div>
      </div>

      <Button size="lg" onClick={onDownload} disabled={busy} className="mt-4">
        {busy ? "⏳ ছবি বানানো হচ্ছে…" : "⬇️ ডাউনলোড ও ফেসবুকে শেয়ার করুন"}
      </Button>

      {error && (
        <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
          ⚠️ {error}
        </p>
      )}

      {done && (
        <div className="vibe-rise mt-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-400/10">
          <p className="font-extrabold text-emerald-800 dark:text-emerald-200">
            ✅ {VIRAL_NOTICE}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#1877f2] px-6 font-bold text-white"
            >
              📘 ফেসবুক খুলুন
            </a>
            <Button size="md" variant="outline" className="sm:w-auto" onClick={copyCaption}>
              {copied ? "✅ কপি হয়েছে!" : "📋 ক্যাপশন কপি করুন"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
