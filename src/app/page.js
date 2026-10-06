import Link from "next/link";
import { FEATURE_TABS, FLOW_STEPS } from "@/data/tiers";
import { BdFlag } from "@/components/ui/BdFlag";

const BN = ["", "১", "২", "৩", "৪"];

export default function Home() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-600/20 sm:p-10">
        <h1 className="flex flex-wrap items-center gap-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          ১ মিনিটে বানান ভাইরাল FB ম্যাপ পোস্টার <BdFlag size={44} rounded={8} />
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg">
          আঞ্চলিক ভাষা, শৈশব স্মৃতি, খেলাধুলা বা ঘোরা জেলা — থিম বেছে নিন, ম্যাপে মার্ক
          করুন, ডাউনলোড করে ফেসবুকে পোস্ট করুন।
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEATURE_TABS.map((t) => (
          <Link
            key={t.id}
            href={t.path}
            className="vibe-rise group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-lg sm:p-6 dark:border-white/10 dark:bg-white/5"
          >
            <span className="text-4xl" aria-hidden>
              {t.emoji}
            </span>
            <span className="mt-2 block text-lg font-extrabold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
              {t.headline}
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t.desc}
            </span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-indigo-600 dark:text-indigo-300">
              শুরু করো →
            </span>
          </Link>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-extrabold text-slate-900 dark:text-white">⚡ যেভাবে কাজ করে</h2>
        <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FLOW_STEPS.map((s) => (
            <li key={s.no} className="rounded-2xl bg-slate-50 p-3 text-center dark:bg-white/5">
              <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-extrabold text-white">
                {BN[s.no]}
              </span>
              <p className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-100">{s.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 sm:text-base dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
        <p className="font-extrabold">📢 ভাইরাল লুপ যেভাবে কাজ করে</p>
        <p className="mt-1">
          শেয়ার API-এর ঝামেলা নেই — হাই-রেজ ছবি সরাসরি ডাউনলোড হবে, তারপর নোটিশ দেখাবে: “ছবিটি
          সেভ হয়েছে! ফেসবুক ওয়ালে বা স্টোরিতে পোস্ট করে বন্ধুদের চমকে দিন।”
        </p>
      </section>
    </div>
  );
}
