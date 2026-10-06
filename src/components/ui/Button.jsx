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
