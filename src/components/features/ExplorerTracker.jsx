"use client";

import { usePersistentState } from "@/hooks/usePersistentState";
import { explorerBadgeText, getRankTier, toBnDigits } from "@/lib/rank";
import { cn } from "@/lib/cn";
import { StudioMap } from "@/components/map/StudioMap";
import { DistrictChips } from "@/components/map/DistrictChips";
import { Badge, Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ExplorerTracker() {
  const [visited, setVisited] = usePersistentState("explorer-visited", []);
  const tier = getRankTier(visited.length);
  const pct = Math.round((visited.length / 64) * 100);

  const toggle = (id) =>
    setVisited((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

  return (
    <div className="flex flex-col gap-4">
      <Card className={cn("border-2", tier.borderColor, "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-400/10 dark:to-yellow-400/10")}>
        <div className="flex items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-400 bg-white text-3xl shadow-lg dark:bg-white/10">
            {tier.badgeEmoji}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-300">তোমার র‍্যাংক</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{tier.title}</p>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {toBnDigits(visited.length)}/৬৪ জেলা • {toBnDigits(pct)}%
            </p>
          </div>
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
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          🥇 Phase 4-এ প্রোফাইল ছবিতে গোল্ড/সিলভার মেডেল ফ্রেম বসবে।
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <StudioMap
          activeIds={visited}
          activeFill="#047857"
          onToggle={toggle}
          desc="ঘোরা জেলাগুলো সবুজে ভরছে"
          caption={`${toBnDigits(visited.length)}/৬৪ জেলা • ${toBnDigits(pct)}%`}
        />

        <Card className="lg:col-span-3">
          <SectionTitle emoji="🏆" title="কোন কোন জেলায় ঘুরেছো?" desc="ম্যাপ বা চিপে ট্যাপ করে মার্ক করো" />
          <DistrictChips
            selected={visited}
            onToggle={toggle}
            selectedClass="border-amber-600 bg-amber-500 text-white shadow-md shadow-amber-500/25"
          />
          {visited.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <Badge>
                📍 {toBnDigits(visited.length)}টি জেলা
              </Badge>
              <Button variant="ghost" size="sm" className="w-auto" onClick={() => setVisited([])}>
                ↺ রিসেট
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
