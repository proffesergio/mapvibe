"use client";

import { DISTRICTS, DIVISIONS, DIVISION_BN } from "@/data/districts";
import { cn } from "@/lib/cn";

/**
 * Mobile-first fallback + accessible interaction list.
 * Division-grouped large-touch chips bound to the same state as the SVG map.
 */
export function DistrictChips({
  selected = [],
  onToggle,
  selectedClass = "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/25",
}) {
  const isSel = (id) => selected.includes(id);

  return (
    <div className="flex flex-col gap-4">
      {DIVISIONS.map((div) => {
        const list = DISTRICTS.filter((d) => d.division === div);
        const count = list.filter((d) => isSel(d.id)).length;
        return (
          <div key={div}>
            <p className="mb-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
              {DIVISION_BN[div]}
              {count > 0 && (
                <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200">
                  {count} ✓
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {list.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={isSel(d.id)}
                  onClick={() => onToggle?.(d.id)}
                  className={cn(
                    "min-h-11 cursor-pointer rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all active:scale-95",
                    isSel(d.id)
                      ? selectedClass
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  )}
                >
                  {isSel(d.id) ? "✓ " : ""}
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
