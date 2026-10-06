"use client";

import { useMemo, useState } from "react";
import { DECADES, MEMORY_CATS, NOSTALGIA_MEMORIES, memoryBadgeText, nostalgiaBadgeText } from "@/data/games";
import { districtById } from "@/data/districts";
import { usePersistentState } from "@/hooks/usePersistentState";
import { toBnDigits } from "@/lib/rank";
import { cn } from "@/lib/cn";
import { RealBdMap } from "@/components/map/RealBdMap";
import { DistrictChips } from "@/components/map/DistrictChips";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DECADE_EMOJI = { "80s": "📺", "90s": "📼", "2000s": "📻", "2010s": "📱" };

export function NostalgiaPicker() {
  const [decadeId, setDecadeId] = usePersistentState("nostalgia-decade", "90s");
  const [districtId, setDistrictId] = usePersistentState("nostalgia-district", null);
  const [memories, setMemories] = usePersistentState("nostalgia-memories", []);
  const [story, setStory] = usePersistentState("nostalgia-story", "");
  const [cat, setCat] = useState("all");

  const decade = DECADES.find((d) => d.id === decadeId) ?? DECADES[1];
  const district = districtId ? districtById(districtId) : null;

  const deck = useMemo(
    () => (cat === "all" ? NOSTALGIA_MEMORIES : NOSTALGIA_MEMORIES.filter((m) => m.cat === cat)),
    [cat]
  );

  const toggleMemory = (id) =>
    setMemories((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle emoji="🕰️" title="কোন দশকে বড় হয়েছো?" desc="দশক বেছে নাও — নিচের কার্ড + পোস্টারের রঙ বদলে যাবে" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DECADES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={decadeId === d.id}
              onClick={() => setDecadeId(d.id)}
              className={cn(
                "cursor-pointer rounded-2xl border-2 p-3 text-center transition-all active:scale-95",
                decadeId === d.id
                  ? "border-amber-500 bg-amber-50 shadow-md shadow-amber-500/15 dark:border-amber-400 dark:bg-amber-400/10"
                  : "border-slate-200 bg-white hover:border-amber-300 dark:border-white/10 dark:bg-white/5"
              )}
            >
              <span className="block text-2xl" aria-hidden>
                {DECADE_EMOJI[d.id] ?? "📼"}
              </span>
              <span className="mt-1 block text-sm font-extrabold text-slate-900 dark:text-white">
                {d.label}
              </span>
              <span className="mt-0.5 block text-xs leading-4 text-slate-500 dark:text-slate-400">{d.hint}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle
          emoji="💭"
          title={`মনে পড়ে? (${toBnDigits(memories.length)})`}
          desc="যা যা তুমি সত্যিই করেছো — ট্যাপ করো। এগুলো পোস্টারে যাবে"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCat("all")}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1.5 text-xs font-extrabold",
              cat === "all" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
            )}
          >
            সব ({toBnDigits(NOSTALGIA_MEMORIES.length)})
          </button>
          {Object.entries(MEMORY_CATS).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCat(id)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-xs font-extrabold",
                cat === id ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {deck.map((m) => {
            const on = memories.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleMemory(m.id)}
                className={cn(
                  "cursor-pointer rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98]",
                  on
                    ? "border-amber-500 bg-amber-50 shadow-md shadow-amber-500/15 dark:border-amber-400 dark:bg-amber-400/10"
                    : "border-slate-200 bg-white hover:border-amber-300 dark:border-white/10 dark:bg-white/5"
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {m.emoji}
                </span>
                <span className="mt-1 block text-sm font-extrabold text-slate-900 dark:text-white">
                  {on ? "✅ " : ""}{m.label}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{m.hint}</span>
              </button>
            );
          })}
        </div>
        {memories.length > 0 && (
          <Button variant="ghost" size="sm" className="mt-2 w-auto" onClick={() => setMemories([])}>
            ↺ স্মৃতি মুছুন
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2 lg:sticky lg:top-20 lg:self-start">
          <SectionTitle emoji="🗺️" title="কোথায় কেটেছে শৈশব?" desc="এই জেলাটাই পোস্টারের ম্যাপে জ্বলবে" />
          <div className="mx-auto max-w-[380px]">
            <RealBdMap
              activeIds={districtId ? [districtId] : []}
              activeFill="#b45309"
              onToggle={(id) => setDistrictId(id)}
            />
          </div>
          <p className="mt-2 text-center text-sm font-bold text-slate-600 dark:text-slate-300">
            {district ? `📍 ${district.name} — এখানেই এই স্মৃতিগুলো` : "জেলা বেছে নাও"}
          </p>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <Card>
            <SectionTitle emoji="🏠" title="শৈশবের জেলা কোনটা?" desc="ম্যাপ বা নিচের চিপ থেকে ১টা জেলা — যেখানে এই আনন্দগুলো পেয়েছো" />
            <DistrictChips
              selected={districtId ? [districtId] : []}
              onToggle={(id) => setDistrictId(id === districtId ? null : id)}
              selectedClass="border-amber-600 bg-amber-500 text-white shadow-md shadow-amber-500/25"
            />
          </Card>
          <Card>
            <SectionTitle emoji="✍️" title="তোমার গল্প (১ লাইন)" desc="পোস্টারে তোমার ভাষায় ছাপা হবে — সর্বোচ্চ ১২০ অক্ষর" />
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value.slice(0, 120))}
              placeholder="যেমন: বৃষ্টির দিনে পুকুরে ঝাঁপ দিতাম দাদার সাথে…"
              rows={2}
              className="w-full rounded-2xl border-2 border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:border-amber-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <p className="mt-1 text-right text-xs font-bold text-slate-400">{toBnDigits(story.length)}/১২০</p>
          </Card>
        </div>
      </div>

      <Card className={cn("border-2", decade.id === "2010s" ? "bg-slate-900 text-white dark:bg-black" : decade.style)}>
        <p className="text-sm font-bold opacity-70">🏅 তোমার ব্যাজ • {decade.themeName}</p>
        <p className="mt-1 text-lg font-extrabold leading-8">
          {district ? nostalgiaBadgeText(decade.label, district.name) : "জেলা সিলেক্ট করলেই ব্যাজ রেডি হবে 👆"}
        </p>
        {memories.length > 0 && (
          <p className="mt-1 text-sm font-bold opacity-80">{memoryBadgeText(memories.length)}</p>
        )}
        {story.trim() && <p className="mt-1 text-sm italic opacity-80">“{story.trim()}”</p>}
        <p className="mt-1 text-sm opacity-70">{decade.sticker}</p>
      </Card>
    </div>
  );
}
