## src/app/layout.js
```
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/auth/Providers";
import { PwaRegister } from "@/components/pwa/PwaRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "ভাইবম্যাপ — বাংলাদেশ ম্যাপ পোস্টার মেকার",
  description:
    "আঞ্চলিক ভাষা, শৈশব স্মৃতি, খেলাধুলা ও ভ্রমণ র‍্যাংক — ফেসবুক পোস্টার বানান ১ মিনিটে।",
  keywords: ["ভাইবম্যাপ", "VibeMap", "বাংলাদেশ ম্যাপ", "ফেসবুক পোস্টার", "আঞ্চলিক ভাষা", "নস্টালজিয়া"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ভাইবম্যাপ",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "ভাইবম্যাপ — ১ মিনিটে ভাইরাল FB পোস্টার",
    description: "থিম বেছে নিন → ম্যাপে পিক করুন → ছবি দিন → ১০৮০×১০৮০ ডাউনলোড",
    type: "website",
    locale: "bn_BD",
  },
};

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function themeInitScript() {
  return `(function(){try{var t=localStorage.getItem("vibemap:theme");if(t!=="dark"){t="light"}document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`;
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${inter.variable} ${hind.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <PwaRegister />
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

```
## src/components/layout/ThemeToggle.jsx
```
"use client";

import { useEffect, useState } from "react";

function currentTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("vibemap:theme");
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
      window.localStorage.setItem("vibemap:theme", theme);
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

```
## src/components/layout/Footer.jsx
```
import { BdFlag } from "@/components/ui/BdFlag";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8 dark:border-white/10">
      <div className="mx-auto w-full max-w-5xl px-4 text-center">
        <p className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <BdFlag size={22} /> ভাইবম্যাপ — আপনার ছবি আপনার ফোনেই থাকে
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          ছবি ডাউনলোড করে ফেসবুক ওয়াল / স্টোরিতে পোস্ট করুন। Made for viral Bangla sharing.
        </p>
      </div>
      {/* PWA install prompt lives in the footer area (mobile-friendly banner) */}
      <PwaInstallPrompt />
    </footer>
  );
}

```
## src/components/layout/Header.jsx
```
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
              ভাইবম্যাপ <BdFlag size={20} />
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

```