"use client";

import { useCallback, useEffect, useState } from "react";
import { SLANGS } from "@/data/slangs";
import { loadJSON, saveJSON } from "@/lib/storage";

const norm = (s) => ({
  id: String(s.id),
  phrase: s.phrase,
  meaning: s.meaning,
  example: s.example ?? "",
  division: s.division ?? "",
  districtId: s.districtId ?? s.regionId ?? "dhaka",
  upazila: s.upazila ?? "",
  contributor: s.contributor ?? "mapvibe",
  upvotes: Number(s.upvotes ?? 0),
  reports: Number(s.reports ?? 0),
  local: Boolean(s.local),
});

const seedFallback = () => SLANGS.map(norm);

/** Public slang feed: Neon API with instant local fallback. */
export function usePublicSlangs() {
  const [slangs, setSlangs] = useState(seedFallback);
  const [db, setDb] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(() => loadJSON("slang-voted", []));
  const [reported, setReported] = useState(() => loadJSON("slang-reported", []));

  const refresh = useCallback(async (opts = {}) => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (opts.q) p.set("q", opts.q);
      if (opts.district && opts.district !== "all") p.set("district", opts.district);
      const res = await fetch(`/api/slangs?${p.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.slangs) && data.slangs.length) {
        setSlangs(data.slangs.map(norm));
        setDb(Boolean(data.db));
      } else if (Array.isArray(data.slangs)) {
        setSlangs(data.slangs.map(norm));
        setDb(Boolean(data.db));
      }
    } catch {
      /* offline → keep seed */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(
    async ({ phrase, meaning, example, division, districtId, upazila, contributor }) => {
      const res = await fetch("/api/slangs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phrase, meaning, example, division, districtId, upazila, contributor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "save failed");
      const entry = norm(data.slang);
      // Instant-publish: prepend optimistically.
      setSlangs((prev) => [entry, ...prev.filter((s) => s.id !== entry.id)]);
      setDb(Boolean(data.db));
      return { entry, db: Boolean(data.db) };
    },
    []
  );

  const upvote = useCallback(
    async (id) => {
      if (voted.includes(id)) return null;
      const next = [...voted, id];
      setVoted(next);
      saveJSON("slang-voted", next);
      setSlangs((prev) => prev.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s)));
      try {
        const res = await fetch(`/api/slangs/${encodeURIComponent(id)}/vote`, { method: "POST" });
        const data = await res.json();
        if (typeof data?.upvotes === "number") {
          setSlangs((prev) => prev.map((s) => (s.id === id ? { ...s, upvotes: data.upvotes } : s)));
        }
      } catch {
        /* optimistic count stays */
      }
      return true;
    },
    [voted]
  );

  const report = useCallback(
    async (id) => {
      if (reported.includes(id)) return false;
      const next = [...reported, id];
      setReported(next);
      saveJSON("slang-reported", next);
      try {
        await fetch(`/api/slangs/${encodeURIComponent(id)}/report`, { method: "POST" });
      } catch {
        /* ignore */
      }
      // Hide locally after reporting to keep feed clean.
      setSlangs((prev) => prev.filter((s) => s.id !== id));
      return true;
    },
    [reported]
  );

  return { slangs, db, loading, voted, reported, refresh, submit, upvote, report };
}
