import { FLOW_STEPS } from "@/data/tiers";
import { cn } from "@/lib/cn";

/** 4-step Bangla flow indicator (Theme → Pick → Photo → Download). */
export function Stepper({ active = 1 }) {
  return (
    <ol className="grid grid-cols-4 gap-2">
      {FLOW_STEPS.map((s) => {
        const done = s.no < active;
        const current = s.no === active;
        return (
          <li
            key={s.no}
            className={cn(
              "rounded-2xl border p-2 text-center sm:p-3",
              current
                ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-400/10"
                : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5",
              done && "opacity-70"
            )}
          >
            <div
              className={cn(
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold",
                current
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
              )}
            >
              {done ? "✓" : <span className="font-bangla">{["", "১", "২", "৩", "৪"][s.no]}</span>}
            </div>
            <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm dark:text-slate-100">
              {s.title}
            </p>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">{s.desc}</p>
          </li>
        );
      })}
    </ol>
  );
}
