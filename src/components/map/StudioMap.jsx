"use client";

import { RealBdMap } from "./RealBdMap";
import { Card, SectionTitle } from "@/components/ui/Card";

/**
 * StudioMap — the ONE map display for every feature.
 * Same card, same sizing, same caption style everywhere
 * (slang / nostalgia / explorer). Only colors + caption change.
 */
export function StudioMap({
  activeIds = [],
  activeFill = "#4f46e5",
  onToggle,
  caption,
  title = "লাইভ ম্যাপ",
  desc,
}) {
  return (
    <Card className="lg:col-span-2 lg:sticky lg:top-20 lg:self-start">
      <SectionTitle emoji="🗺️" title={title} desc={desc} />
      <div className="mx-auto max-w-[380px]">
        <RealBdMap activeIds={activeIds} activeFill={activeFill} onToggle={onToggle} />
      </div>
      {caption ? (
        <p className="mt-2 text-center text-sm font-bold text-slate-600 dark:text-slate-300">
          {caption}
        </p>
      ) : null}
    </Card>
  );
}
