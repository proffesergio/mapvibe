"use client";

import { useEffect, useState } from "react";
import { getBaseGames } from "@/lib/adminData";
import { usePersistentState } from "@/hooks/usePersistentState";
import { toBnDigits } from "@/lib/rank";
import { cn } from "@/lib/cn";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const GAME_EMOJI = ["🪁", "🏏", "🤸", "🔮", "⛵", "🙈", "🏸", "🏃", "🌊", "👰"];

export function GamesTracker() {
  const [picked, setPicked] = usePersistentState("games-picked", []);
  const [custom, setCustom] = usePersistentState("games-custom", []);
  const [base, setBase] = useState(() => getBaseGames());
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const onChange = () => setBase(getBaseGames());
    window.addEventListener("mapvibe:change", onChange);
    return () => window.removeEventListener("mapvibe:change", onChange);
  }, []);

  const all = [...base, ...custom.filter((g) => !base.some((b) => b.id === g.id))];
  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const addCustom = () => {
    const name = draft.trim().slice(0, 40);
    if (!name) return;
    const id = `c${Date.now()}`;
    setCustom((c) => [...c, { id, name }]);
    setPicked((p) => [...p, id]);
    setDraft("");
  };

  const removeCustom = (id) => {
    setCustom((c) => c.filter((g) => g.id !== id));
    setPicked((p) => p.filter((x) => x !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle
          emoji="🪁"
          title="ছোটবেলায় কোন খেলাগুলো খেলেছো?"
          desc="ট্যাপ করে সিলেক্ট করো — নতুন খেলার নামও যোগ করতে পারো"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {all.map((g, i) => {
            const on = picked.includes(g.id);
            const isCustom = g.id.startsWith("c");
            return (
              <div key={g.id} className="relative">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(g.id)}
                  className={cn(
                    "w-full cursor-pointer rounded-2xl border-2 p-3 text-center transition-all active:scale-95",
                    on
                      ? "border-emerald-600 bg-emerald-50 shadow-md shadow-emerald-600/10 dark:border-emerald-400 dark:bg-emerald-400/10"
                      : "border-slate-200 bg-white hover:border-emerald-300 dark:border-white/10 dark:bg-white/5"
                  )}
                >
                  <span className="block text-2xl" aria-hidden>
                    {GAME_EMOJI[i % GAME_EMOJI.length]}
                  </span>
                  <span className="mt-1 block text-sm font-extrabold text-slate-900 dark:text-white">
                    {on ? "✅ " : ""}
                    {g.name}
                  </span>
                </button>
                {isCustom && (
                  <button
                    type="button"
                    aria-label={`${g.name} মুছুন`}
                    onClick={() => removeCustom(g.id)}
                    className="absolute -right-1 -top-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-xs text-white shadow"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="নতুন খেলার নাম লিখো… (যেমন: গোল্লাছুট)"
            maxLength={40}
            className="h-12 flex-1 rounded-2xl border-2 border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <Button size="md" variant="dark" className="w-auto shrink-0" onClick={addCustom}>
            ＋ যোগ
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          💡 তোমার যোগ করা খেলা এই ডিভাইসে সেভ থাকবে — অ্যাডমিন সাজেশন হিসেবে সবার জন্য যোগ করতে
          পারবে।
        </p>
      </Card>

      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-400/20 dark:from-emerald-400/10 dark:to-teal-400/10">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-300">
          🏅 তোমার ব্যাজ ({toBnDigits(picked.length)}টি খেলা)
        </p>
        <p className="mt-1 text-lg font-extrabold leading-8 text-slate-900 dark:text-white">
          {picked.length > 0
            ? `আসল ৯০s কিড! আমি ${toBnDigits(picked.length)}টি খেলা খেলেছি।`
            : "কমপক্ষে ১টা খেলা সিলেক্ট করো 👆"}
        </p>
        {picked.length > 0 && (
          <Button variant="ghost" size="sm" className="mt-2 w-auto" onClick={() => setPicked([])}>
            ↺ সব মুছুন
          </Button>
        )}
      </Card>
    </div>
  );
}
