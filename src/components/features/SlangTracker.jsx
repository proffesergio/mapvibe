"use client";

import { useMemo, useState } from "react";
import { slangBadgeText } from "@/data/slangs";
import { DISTRICTS, DIVISION_BN, DIVISIONS, districtById } from "@/data/districts";
import { UPAZILA_COUNT, upazilasOf } from "@/data/upazilas";
import { usePersistentState } from "@/hooks/usePersistentState";
import { usePublicSlangs } from "@/hooks/usePublicSlangs";
import { loadJSON, saveJSON } from "@/lib/storage";
import { toBnDigits } from "@/lib/rank";
import { cn } from "@/lib/cn";
import { RealBdMap } from "@/components/map/RealBdMap";
import { Badge, Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function regionOf(s) {
  return s.districtId ?? s.regionId ?? "dhaka";
}

export function SlangTracker() {
  const [picked, setPicked] = usePersistentState("slang-picked", []);
  const { slangs, db, loading, voted, submit, upvote, report } = usePublicSlangs();

  const [q, setQ] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [form, setForm] = useState({
    division: "Dhaka",
    districtId: "dhaka",
    upazila: "",
    phrase: "",
    meaning: "",
    example: "",
    contributor: "",
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const districtsInDivision = useMemo(
    () => DISTRICTS.filter((d) => d.division === form.division),
    [form.division]
  );
  const upazilaList = useMemo(() => upazilasOf(form.districtId), [form.districtId]);
  const upazilaValue = upazilaList.includes(form.upazila) ? form.upazila : (upazilaList[0] ?? "");

  const pickDivision = (division) => {
    const first = DISTRICTS.find((d) => d.division === division)?.id ?? "dhaka";
    setForm({ ...form, division, districtId: first, upazila: "" });
  };
  const pickDistrict = (districtId) => setForm({ ...form, districtId, upazila: "" });

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return slangs.filter((s) => {
      if (filterDistrict !== "all" && regionOf(s) !== filterDistrict) return false;
      if (!needle) return true;
      return (
        s.phrase.toLowerCase().includes(needle) ||
        s.meaning.toLowerCase().includes(needle) ||
        (s.upazila ?? "").toLowerCase().includes(needle)
      );
    });
  }, [slangs, q, filterDistrict]);

  const regionIds = [...new Set(picked.map((id) => slangs.find((s) => s.id === id)).filter(Boolean).map(regionOf))];

  // Fallback for poster: remember region of picked ids (covers DB rows).
  const persistRegionMap = (id, districtId) => {
    try {
      const map = loadJSON("slang-picked-regions", {});
      map[id] = districtId;
      saveJSON("slang-picked-regions", map);
    } catch {
      /* ignore */
    }
  };

  const toggle = (s) => {
    setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]));
    persistRegionMap(s.id, regionOf(s));
  };

  const onSubmit = async () => {
    if (!form.phrase.trim() || !form.meaning.trim() || saving) return;
    setSaving(true);
    setNotice("");
    try {
      const { entry } = await submit({
        phrase: form.phrase.trim().slice(0, 80),
        meaning: form.meaning.trim().slice(0, 160),
        example: form.example.trim().slice(0, 200),
        division: form.division,
        districtId: form.districtId,
        upazila: upazilaValue,
        contributor: form.contributor.trim().slice(0, 40) || "বেনামি",
      });
      setPicked((p) => (p.includes(entry.id) ? p : [...p, entry.id]));
      persistRegionMap(entry.id, entry.districtId);
      setForm((f) => ({ ...f, upazila: "", phrase: "", meaning: "", example: "" }));
      setNotice(db ? "✅ প্রকাশ হয়েছে! সবার তালিকায় যোগ হলো।" : "✅ সেভ হয়েছে (এই ডিভাইসে — Neon যুক্ত করলে সবার কাছে যাবে)।");
    } catch {
      setNotice("⚠️ সেভ হয়নি — আবার চেষ্টা করো।");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(""), 3500);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2 lg:sticky lg:top-20 lg:self-start">
          <SectionTitle emoji="🗺️" title="লাইভ ম্যাপ" desc="সিলেক্ট করলেই উৎপত্তি জেলা ভরে উঠবে" />
          <div className="mx-auto max-w-[380px]">
            <RealBdMap activeIds={regionIds} activeFill="#7c3aed" />
          </div>
          <p className="mt-2 text-center text-sm font-bold text-slate-600 dark:text-slate-300">
            {toBnDigits(regionIds.length)}টি জেলা হাইলাইট • {toBnDigits(picked.length)}টি ভাষা
          </p>
        </Card>

        <Card className="lg:col-span-3">
          <SectionTitle
            emoji="🗣️"
            title="কোন আঞ্চলিক ভাষাগুলো বোঝো? ট্যাপ করো"
            desc={loading ? "তালিকা আসছে…" : `${toBnDigits(visible.length)}টি ভাষা • সেরাগুলো ভোটে উপরে থাকে`}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="খুঁজো… (যেমন: বেইন্নালা, সকাল)"
              className="h-11 flex-1 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold outline-none focus:border-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-900"
            >
              <option value="all">📍 সব জেলা</option>
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {visible.map((s) => {
              const on = picked.includes(s.id);
              const hasVoted = voted.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={cn(
                    "rounded-2xl border-2 p-3 transition-all",
                    on
                      ? "border-violet-600 bg-violet-50 shadow-md shadow-violet-600/10 dark:border-violet-400 dark:bg-violet-400/10"
                      : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s)}
                    className="block w-full cursor-pointer text-left"
                  >
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {on ? "✅ " : ""}
                      {s.phrase}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                      {s.meaning} • 📍 {districtById(regionOf(s))?.name ?? regionOf(s)}
                      {s.upazila ? `, ${s.upazila}` : ""}
                    </span>
                    {s.example ? (
                      <span className="mt-0.5 block text-xs italic text-slate-400">“{s.example}”</span>
                    ) : null}
                  </button>
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold">
                    <button
                      type="button"
                      disabled={hasVoted}
                      onClick={() => upvote(s.id)}
                      className={cn(
                        "cursor-pointer rounded-full px-3 py-1.5",
                        hasVoted
                          ? "bg-violet-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-violet-100 dark:bg-white/10 dark:text-slate-200"
                      )}
                      title={hasVoted ? "ভোট দিয়েছো" : "ভালো লাগলে ভোট দাও"}
                    >
                      {hasVoted ? "▲ " : "△ "} {toBnDigits(s.upvotes)}
                    </button>
                    <button
                      type="button"
                      onClick={() => report(s.id)}
                      className="cursor-pointer rounded-full px-2 py-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-400/10"
                      title="ভুল / বাজে হলে রিপোর্ট করো"
                    >
                      ⚑ রিপোর্ট
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {!visible.length && !loading && (
            <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-center text-sm font-bold text-slate-500 dark:bg-white/5 dark:text-slate-300">
              কিছু পাওয়া যায়নি — নিচে নতুন ভাষা যোগ করো 👇
            </p>
          )}
        </Card>
      </div>

      <Card>
        <SectionTitle emoji="＋" title="নতুন ভাষা যোগ করো" desc={`বিভাগ → জেলা → উপজেলা (${UPAZILA_COUNT}টি) বেছে → স্থানীয় ভাষা → প্রমিত বাংলা অর্থ`} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-500 dark:text-slate-400">
            বিভাগ
            <select
              value={form.division}
              onChange={(e) => pickDivision(e.target.value)}
              className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold text-slate-800 outline-none focus:border-violet-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            >
              {DIVISIONS.map((dv) => (
                <option key={dv} value={dv}>
                  {DIVISION_BN[dv] ?? dv}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-500 dark:text-slate-400">
            জেলা
            <select
              value={form.districtId}
              onChange={(e) => pickDistrict(e.target.value)}
              className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold text-slate-800 outline-none focus:border-violet-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            >
              {districtsInDivision.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-500 dark:text-slate-400">
            উপজেলা ({toBnDigits(upazilaList.length)}টি)
            <select
              value={upazilaValue}
              onChange={(e) => setForm({ ...form, upazila: e.target.value })}
              className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold text-slate-800 outline-none focus:border-violet-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            >
              {upazilaList.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={form.phrase}
            onChange={(e) => setForm({ ...form, phrase: e.target.value })}
            placeholder="স্থানীয় ভাষা / শব্দ / বাক্য (যেমন: বেইন্নালা)"
            className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold outline-none focus:border-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <input
            value={form.meaning}
            onChange={(e) => setForm({ ...form, meaning: e.target.value })}
            placeholder="প্রমিত বাংলায় অর্থ (যেমন: সকাল)"
            className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold outline-none focus:border-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={form.example}
            onChange={(e) => setForm({ ...form, example: e.target.value })}
            placeholder="উদাহরণ বাক্য (ঐচ্ছিক)"
            className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold outline-none focus:border-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <input
            value={form.contributor}
            onChange={(e) => setForm({ ...form, contributor: e.target.value })}
            placeholder="তোমার নাম / ডাকনাম (ঐচ্ছিক)"
            className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold outline-none focus:border-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button onClick={onSubmit} disabled={saving || !form.phrase.trim() || !form.meaning.trim()} className="sm:w-auto">
            {saving ? "⏳ প্রকাশ হচ্ছে…" : "＋ প্রকাশ করো"}
          </Button>
          {notice && <p className="text-sm font-bold text-emerald-600 dark:text-emerald-300">{notice}</p>}
        </div>
      </Card>

      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:border-violet-400/20 dark:from-violet-400/10 dark:to-fuchsia-400/10">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-300">
          🏅 তোমার ব্যাজ ({toBnDigits(picked.length)}টি সিলেক্ট)
        </p>
        <p className="mt-1 text-lg font-extrabold leading-8 text-slate-900 dark:text-white">
          {picked.length > 0 ? slangBadgeText(picked.length) : "কমপক্ষে ১টা ভাষা সিলেক্ট করো 👆"}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {regionIds.map((r) => (
            <Badge key={r}>📍 {districtById(r)?.name}</Badge>
          ))}
        </div>
        {picked.length > 0 && (
          <Button variant="ghost" size="sm" className="mt-2 w-auto" onClick={() => setPicked([])}>
            ↺ সব মুছুন
          </Button>
        )}
      </Card>
    </div>
  );
}
