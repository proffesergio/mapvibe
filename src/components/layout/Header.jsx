"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FEATURE_TABS } from "@/data/tiers";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { BdFlag } from "@/components/ui/BdFlag";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-600/30">
            🗺️
          </span>
          <span className="leading-tight">
            <span className="flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              ম্যাপভাইব <BdFlag size={20} />
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block dark:text-slate-400">
              বাংলাদেশ ম্যাপ পোস্টার
            </span>
          </span>
        </Link>

        <nav aria-label="ফিচার" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1">
          {FEATURE_TABS.map((t) => {
            const href = t.path;
            const on = pathname === href;
            return (
              <Link
                key={t.id}
                href={href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-extrabold transition-all sm:px-4",
                  on
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                )}
              >
                <span aria-hidden>{t.emoji}</span>
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
