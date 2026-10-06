"use client";

import { useState } from "react";
import { DISTRICTS } from "@/data/districts";
import {
  exportDataset,
  getBaseGames,
  getSlangs,
  resetBaseGames,
  resetSlangs,
  saveBaseGames,
  saveSlangs,
} from "@/lib/adminData";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Admin: edit local slang/games content + export.
 * Public slang now lives in Neon (see scripts/neon-slang-schema.sql).
 */
export function AdminPanel() {
  const [tab, setTab] = useState("slang");
  const [slangs, setSlangs] = useState(() => getSlangs());
  const [games, setGames] = useState(() => getBaseGames());
  const [form, setForm] = useState({ phrase: "", meaning: "", regionId: "dhaka" });
  const [gameName, setGameName] = useState("");
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState("");

  const flash = (msg) => {
    setSaved(msg);
    setTimeout(() => setSaved(""), 2000);
  };

  const commitSlangs = (list) => {
    setSlangs(list);
    saveSlangs(list);
    flash("✅ সেভ হয়েছে (এই ডিভাইসে লাইভ)");
  };

  const upsertSlang = () => {
    const phrase = form.phrase.trim().slice(0, 40);
    const meaning = form.meaning.trim().slice(0, 60);
    if (!phrase || !meaning) return;
    if (editId) {
      commitSlangs(slangs.map((s) => (s.id === editId ? { ...s, phrase, meaning, regionId: form.regionId } : s)));
      setEditId(null);
    } else {
      commitSlangs([...slangs, { id: `x${Date.now()}`, phrase, meaning, regionId: form.regionId }]);
    }
    setForm({ phrase: "", meaning: "", regionId: "dhaka" });
  };

  const addGame = () => {
    const name = gameName.trim().slice(0, 40);
    if (!name) return;
    const next = [...games, { id: `x${Date.now()}`, name }];
    setGames(next);
    saveBaseGames(next);
    setGameName("");
    flash("✅ সেভ হয়েছে (এই ডিভাইসে লাইভ)");
  };

  const downloadJSON = () => {
    const blob = new Blob([exportDataset()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mapvibe-dataset.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {saved && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          {saved}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 rounded-3xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/5">
        {[
          { id: "slang", label: "🗣️ স্ল্যাং" },
          { id: "games", label: "🪁 খেলা" },
          { id: "export", label: "📦 এক্সপোর্ট" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "cursor-pointer rounded-2xl py-3 text-sm font-extrabold",
              tab === t.id ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "slang" && (
        <Card>
          <SectionTitle emoji="🗣️" title={`স্ল্যাং ম্যানেজমেন্ট (${slangs.length})`} desc="ভুল তথ্য ঠিক করো, নতুন স্ল্যাং যোগ করো" />
          <div className="flex flex-col gap-2">
            {slangs.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 p-2 pl-3 text-sm dark:border-white/10"
              >
                <span className="flex-1 font-bold text-slate-800 dark:text-slate-100">
                  {s.phrase} <span className="font-medium text-slate-500">• {s.meaning}</span>
                </span>
                <button
                  onClick={() => {
                    setForm({ phrase: s.phrase, meaning: s.meaning, regionId: s.regionId });
                    setEditId(s.id);
                  }}
                  className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 font-bold dark:bg-white/10"
                >
                  ✏️
                </button>
                <button
                  onClick={() => commitSlangs(slangs.filter((x) => x.id !== s.id))}
                  className="cursor-pointer rounded-xl bg-rose-100 px-3 py-2 font-bold text-rose-600 dark:bg-rose-400/10"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
            <p className="mb-2 text-sm font-extrabold">{editId ? "✏️ এডিট করো" : "＋ নতুন স্ল্যাং"}</p>
            <div className="flex flex-col gap-2">
              <input
                value={form.phrase}
                onChange={(e) => setForm({ ...form, phrase: e.target.value })}
                placeholder="স্ল্যাং (যেমন: বেইন্নালা)"
                className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <input
                value={form.meaning}
                onChange={(e) => setForm({ ...form, meaning: e.target.value })}
                placeholder="অর্থ (যেমন: সকাল)"
                className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <select
                value={form.regionId}
                onChange={(e) => setForm({ ...form, regionId: e.target.value })}
                className="h-11 rounded-xl border-2 border-slate-200 px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-900"
              >
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    📍 {d.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button size="md" onClick={upsertSlang} className="flex-1">
                  {editId ? "আপডেট" : "যোগ করো"}
                </Button>
                {editId && (
                  <Button
                    size="md"
                    variant="ghost"
                    className="w-auto"
                    onClick={() => {
                      setEditId(null);
                      setForm({ phrase: "", meaning: "", regionId: "dhaka" });
                    }}
                  >
                    বাতিল
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Button
            size="md"
            variant="ghost"
            className="mt-3 w-auto"
            onClick={() => {
              resetSlangs();
              setSlangs(getSlangs());
              flash("↺ ডিফল্টে ফেরত গেছে");
            }}
          >
            ↺ ডিফল্ট ডেটাসেটে ফেরত যাও
          </Button>
        </Card>
      )}

      {tab === "games" && (
        <Card>
          <SectionTitle emoji="🪁" title={`খেলা ম্যানেজমেন্ট (${games.length})`} desc="সাজেস্টেড খেলার তালিকা এডিট করো" />
          <div className="flex flex-col gap-2">
            {games.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 p-2 pl-3 text-sm font-bold dark:border-white/10"
              >
                <span className="flex-1 dark:text-slate-100">{g.name}</span>
                <button
                  onClick={() => {
                    const next = games.filter((x) => x.id !== g.id);
                    setGames(next);
                    saveBaseGames(next);
                    flash("✅ সেভ হয়েছে");
                  }}
                  className="cursor-pointer rounded-xl bg-rose-100 px-3 py-2 text-rose-600 dark:bg-rose-400/10"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGame()}
              placeholder="নতুন খেলার নাম…"
              className="h-12 flex-1 rounded-2xl border-2 border-slate-200 px-4 text-sm font-bold outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <Button size="md" className="w-auto shrink-0" onClick={addGame}>
              ＋ যোগ
            </Button>
          </div>
          <Button
            size="md"
            variant="ghost"
            className="mt-3 w-auto"
            onClick={() => {
              resetBaseGames();
              setGames(getBaseGames());
              flash("↺ ডিফল্টে ফেরত গেছে");
            }}
          >
            ↺ ডিফল্টে ফেরত যাও
          </Button>
        </Card>
      )}

      {tab === "export" && (
        <Card>
          <SectionTitle emoji="📦" title="ডেটাসেট এক্সপোর্ট" desc="এই ডিভাইসের লোকাল এডিট JSON হিসেবে ডাউনলোড করো" />
          <Button onClick={downloadJSON}>⬇️ mapvibe-dataset.json ডাউনলোড</Button>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            💡 পাবলিক ভাষা ডেটা এখন Neon ডাটাবেজে থাকে — রিপোর্ট ৫+ হলে এন্ট্রি অটো-হাইড হয়।
          </p>
        </Card>
      )}
    </div>
  );
}
