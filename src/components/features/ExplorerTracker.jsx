"use client";

import { useMemo, useRef, useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { useStudioSnapshot } from "@/hooks/useStudioSnapshot";
import { explorerBadgeText, getRankTier, toBnDigits } from "@/lib/rank";
import { cn } from "@/lib/cn";
import { DISTRICTS, DIVISIONS, DIVISION_BN } from "@/data/districts";
import { RealBdMap } from "@/components/map/RealBdMap";
import { PosterCanvas } from "@/components/poster/PosterCanvas";
import { AvatarUploader } from "@/components/avatar/AvatarUploader";
import { VIRAL_NOTICE, downloadJpg, downloadPdf, downloadPoster } from "@/lib/download";
import { Badge, Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/**
 * Explorer — SINGLE map studio.
 *
 * Layout (mobile-first):
 *  - xs: stacked — rank → map → districts → photo → download lives inside map card
 *  - lg: split — left sticky single map (+ JPG export), right scrollable selector + photo
 *
 * Only ONE visible <RealBdMap /> on the page. The 1080 poster node for
 * JPG export is rendered off-screen (aria-hidden) so html-to-image still works
 * without showing a second duplicate map.
 */
export function ExplorerTracker() {
  const [visited, setVisited] = usePersistentState("explorer-visited", []);
  const snap = useStudioSnapshot();
  const [query, setQuery] = useState("");
  const [openDivs, setOpenDivs] = useState(() => Object.fromEntries(DIVISIONS.map((d) => [d, true])));

  const posterRef = useRef(null);
  const [busyFmt, setBusyFmt] = useState(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  // Last-picked district ripple for the animated live map view.
  const [pulse, setPulse] = useState({ id: null, key: 0 });

  const tier = getRankTier(visited.length);
  const pct = Math.round((visited.length / 64) * 100);
  const selectedSet = useMemo(() => new Set(visited), [visited]);
  const displayName = snap.name?.trim() || "আমি";

  const markPulse = (id) => setPulse((p) => ({ id, key: p.key + 1 }));

  const toggle = (id) => {
    setDone(false);
    markPulse(id);
    setVisited((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  };

  const toggleDivision = (open) =>
    setOpenDivs((s) => ({ ...s, [open]: !s[open] }));

  const selectDivision = (div) => {
    const ids = DISTRICTS.filter((d) => d.division === div).map((d) => d.id);
    if (ids.length) markPulse(ids[ids.length - 1]);
    setVisited((v) => [...new Set([...v, ...ids])]);
  };

  const clearDivision = (div) => {
    const ids = new Set(DISTRICTS.filter((d) => d.division === div).map((d) => d.id));
    setVisited((v) => v.filter((x) => !ids.has(x)));
  };

  const q = query.trim().toLowerCase();
  const matchCount = q
    ? DISTRICTS.filter((d) => d.name.toLowerCase().includes(q)).length
    : 64;

  const onDownload = async (fmt) => {
    if (busyFmt) return;
    setBusyFmt(fmt);
    setError("");
    setDone(false);
    try {
      if (fmt === "jpg") await downloadJpg(posterRef.current, "vibemap-explorer-1080.jpg");
      else if (fmt === "pdf") await downloadPdf(posterRef.current, "vibemap-explorer-1080.pdf");
      else await downloadPoster(posterRef.current, "vibemap-explorer-1080.png");
      setDone(true);
    } catch {
      setError("ডাউনলোড ব্যর্থ — আরেকবার চেষ্টা করো।");
    } finally {
      setBusyFmt(null);
    }
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(`আমার ভাইবম্যাপ এক্সপ্লোরার পোস্টার! 🗺️🇧🇩 ${toBnDigits(visited.length)}/৬৪ জেলা #VibeMap #বাংলাদেশ`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Rank strip — full width, compact */}
      <Card
        className={cn(
          "border-2",
          tier.borderColor,
          "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-400/10 dark:to-yellow-400/10"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-amber-400 bg-white text-2xl shadow-lg sm:h-16 sm:w-16 sm:text-3xl dark:bg-white/10">
            {tier.badgeEmoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-500 sm:text-sm dark:text-slate-300">তোমার র‍্যাংক</p>
            <p className="truncate text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
              {tier.title}
            </p>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {toBnDigits(visited.length)}/৬৪ জেলা • {toBnDigits(pct)}%
            </p>
          </div>
          {visited.length > 0 && (
            <Button variant="ghost" size="sm" className="w-auto shrink-0" onClick={() => setVisited([])}>
              ↺ রিসেট
            </Button>
          )}
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">
          {explorerBadgeText(visited.length)}
        </p>
      </Card>

      {/* Split studio: single map aside + selector aside */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
        {/* LEFT — the ONLY visible map */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card className="border-amber-200/70 dark:border-amber-400/20">
            <SectionTitle
              emoji="🗺️"
              title="লাইভ ম্যাপ"
              desc="ঘোরা জেলায় ট্যাপ করলেই সবুজ হবে — এটাই JPG-তে যাবে"
            />
            {/* Identity — avatar + name + Bangla header (mirrors the JPG poster) */}
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-amber-50/70 px-3 py-2 dark:bg-amber-400/10">
              {snap.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={snap.avatar}
                  alt="তোমার প্রোফাইল ছবি"
                  className="h-12 w-12 shrink-0 rounded-full border-2 border-amber-500 object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-white text-2xl dark:bg-white/10"
                >
                  🙂
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <p className="truncate text-sm font-bold text-slate-600 dark:text-slate-300">
                  আমার চোখে বাংলাদেশ
                </p>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[420px] touch-manipulation">
              <RealBdMap
                activeIds={visited}
                activeFill="#047857"
                onToggle={toggle}
                pulseId={pulse.id}
                pulseKey={pulse.key}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-2 text-center text-sm font-bold text-slate-600 dark:text-slate-300">
              {toBnDigits(visited.length)}/৬৪ জেলা • {toBnDigits(pct)}% • ট্যাপ করে মার্ক করো
            </p>

            {/* JPG export lives with the single map */}
            <div className="mt-4 flex flex-col gap-2">
              <Button size="lg" onClick={() => onDownload("jpg")} disabled={Boolean(busyFmt)} className="w-full">
                {busyFmt === "jpg" ? "⏳ তৈরি হচ্ছে…" : "📷 JPG ডাউনলোড (১০৮০×১০৮০)"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => onDownload("png")}
                  disabled={Boolean(busyFmt)}
                  className="w-full"
                >
                  {busyFmt === "png" ? "⏳…" : "🖼️ PNG"}
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => onDownload("pdf")}
                  disabled={Boolean(busyFmt)}
                  className="w-full"
                >
                  {busyFmt === "pdf" ? "⏳…" : "📄 PDF"}
                </Button>
              </div>
            </div>
            <p className="mt-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
              ⬇️ JPG চাপ দাও → ফেসবুক ওয়াল / স্টোরিতে শেয়ার করো
            </p>

            {error && (
              <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                ⚠️ {error}
              </p>
            )}
            {done && (
              <div className="vibe-rise mt-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-400/10">
                <p className="text-sm font-extrabold text-emerald-800 sm:text-base dark:text-emerald-200">
                  ✅ {VIRAL_NOTICE}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#1877f2] px-6 text-sm font-bold text-white sm:text-base"
                  >
                    📘 ফেসবুক খুলুন
                  </a>
                  <Button size="md" variant="outline" className="w-full" onClick={copyCaption}>
                    {copied ? "✅ কপি হয়েছে!" : "📋 ক্যাপশন কপি করুন"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT — selection + photo */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <SectionTitle
              emoji="🏆"
              title="কোন কোন জেলায় ঘুরেছো?"
              desc="ডান পাশ থেকে সার্চ / বিভাগ ধরে সিলেক্ট করো — ম্যাপে সাথে সাথে বসবে"
            />

            {/* Search — key for mobile usability across 64 chips */}
            <div className="mb-3 flex items-center gap-2">
              <label htmlFor="explorer-search" className="sr-only">
                জেলা খুঁজুন
              </label>
              <div className="relative flex-1">
                <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                  🔍
                </span>
                <input
                  id="explorer-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="জেলা খুঁজুন… যেমন: কক্সবাজার"
                  inputMode="search"
                  className="h-12 w-full rounded-2xl border-2 border-slate-200 bg-white pr-10 pl-11 text-sm font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400 focus:border-amber-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="সার্চ মুছুন"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    ✕
                  </button>
                )}
              </div>
              <Badge className="shrink-0">📍 {toBnDigits(visited.length)}টি</Badge>
            </div>
            {q && (
              <p className="mb-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                “{query.trim()}” — {toBnDigits(matchCount)}টি মিল
              </p>
            )}

            {/* Division-grouped selector — collapsible for long mobile scroll */}
            <div className="flex flex-col gap-3">
              {DIVISIONS.map((div) => {
                const list = DISTRICTS.filter((d) => d.division === div).filter(
                  (d) => !q || d.name.toLowerCase().includes(q)
                );
                if (list.length === 0) return null;
                const total = DISTRICTS.filter((d) => d.division === div).length;
                const count = DISTRICTS.filter(
                  (d) => d.division === div && selectedSet.has(d.id)
                ).length;
                const open = openDivs[div];
                return (
                  <div
                    key={div}
                    className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10"
                  >
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 dark:bg-white/5">
                      <button
                        type="button"
                        onClick={() => toggleDivision(div)}
                        aria-expanded={open}
                        className="flex min-h-10 flex-1 cursor-pointer items-center gap-2 text-left"
                      >
                        <span
                          aria-hidden
                          className={cn("text-xs transition-transform", open ? "rotate-90" : "")}
                        >
                          ▶
                        </span>
                        <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
                          {DIVISION_BN[div]}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
                          {toBnDigits(count)}/{toBnDigits(total)}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => selectDivision(div)}
                        className="cursor-pointer rounded-full px-2 py-1 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50 active:scale-95 dark:text-emerald-300 dark:hover:bg-white/10"
                      >
                        সব ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => clearDivision(div)}
                        className="cursor-pointer rounded-full px-2 py-1 text-xs font-extrabold text-slate-500 hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-white/10"
                      >
                        মুছুন
                      </button>
                    </div>
                    {open && (
                      <div className="flex flex-wrap gap-2 p-3">
                        {list.map((d) => {
                          const on = selectedSet.has(d.id);
                          return (
                            <button
                              key={d.id}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggle(d.id)}
                              className={cn(
                                "min-h-11 cursor-pointer rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all active:scale-95",
                                on
                                  ? "border-amber-600 bg-amber-500 text-white shadow-md shadow-amber-500/25"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-amber-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                              )}
                            >
                              {on ? "✓ " : ""}
                              {d.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {q && matchCount === 0 && (
                <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-bold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  কোনো জেলা মিলেনি — অন্য নামে খুঁজুন
                </p>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle
              emoji="📷"
              title="প্রোফাইল ছবি দাও"
              desc="ছবি তোমার ফোনেই থাকে — সার্ভারে আপলোড হয় না। পোস্টারের উপরে বসবে।"
            />
            <AvatarUploader />
          </Card>
        </div>
      </div>

      {/* Hidden 1080 poster node — export only, NOT a second visible map */}
      <div
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: "fixed",
          left: -20000,
          top: 0,
          width: 1080,
          height: 1080,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <PosterCanvas tab="explorer" snap={snap} innerRef={posterRef} />
      </div>
    </div>
  );
}
