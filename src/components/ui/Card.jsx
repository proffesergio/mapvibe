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
