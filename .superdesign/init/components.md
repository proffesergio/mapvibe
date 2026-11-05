## src/components/ui/Card.jsx
```
import { cn } from "@/lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        "vibe-rise rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
        "dark:border-white/10 dark:bg-white/5 dark:shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function Badge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700",
        "dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ emoji, title, desc }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
        <span className="mr-2" aria-hidden>
          {emoji}
        </span>
        {title}
      </h2>
      {desc ? (
        <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

```
## src/components/ui/Button.jsx
```
import { cn } from "@/lib/cn";

const VARIANTS = {
  primary:
    "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 active:scale-[0.98]",
  dark: "bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  outline:
    "border-2 border-slate-200 bg-white text-slate-900 hover:border-indigo-400 hover:text-indigo-700 dark:border-white/15 dark:bg-white/5 dark:text-white",
  ghost: "text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-white/10",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export function Button({ variant = "primary", size = "lg", className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-2xl font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
}

```
## src/components/ui/Stepper.jsx
```
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

```
## src/components/ui/BdFlag.jsx
```
/**
 * Bangladesh flag as inline SVG (flag emojis render as "BD" text on Windows).
 * Safe for html-to-image poster export.
 */
export function BdFlag({ size = 20, className, rounded = 4 }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 30 18"
      aria-label="বাংলাদেশের পতাকা"
      role="img"
      className={className}
      style={{ borderRadius: rounded, display: "inline-block", verticalAlign: "-2px" }}
    >
      <rect width="30" height="18" fill="#006a4e" />
      <circle cx="13.5" cy="9" r="6" fill="#f42a41" />
    </svg>
  );
}

```