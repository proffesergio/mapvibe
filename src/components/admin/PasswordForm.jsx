"use client";

import { verifyAdmin } from "@/app/admin/actions";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/** Password gate — the secret never leaves the server. */
export function PasswordForm({ error, setup }) {
  return (
    <Card>
      <SectionTitle emoji="🔐" title="অ্যাডমিন লগইন" desc="Vercel env (ADMIN_PASSWORD) দিয়ে সেট করা পাসওয়ার্ড দাও" />
      {error === "1" && (
        <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
          ⚠️ ভুল পাসওয়ার্ড
        </p>
      )}
      {setup && (
        <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
          ⚙️ ADMIN_PASSWORD env সেট করা নেই — Vercel/local .env-এ যোগ করে restart দাও।
        </p>
      )}
      <form action={verifyAdmin} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          placeholder="পাসওয়ার্ড"
          autoComplete="current-password"
          className="h-12 rounded-2xl border-2 border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        <Button type="submit">প্রবেশ করো →</Button>
      </form>
    </Card>
  );
}
