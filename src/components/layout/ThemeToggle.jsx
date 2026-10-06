"use client";

import { useEffect, useState } from "react";

function currentTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("mapvibe:theme");
  if (saved === "dark" || saved === "light") return saved;
  return "light"; // Light default per user choice
}

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem("mapvibe:theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="থিম বদলান"
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-lg transition hover:border-indigo-400 dark:border-white/15 dark:bg-white/10"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
