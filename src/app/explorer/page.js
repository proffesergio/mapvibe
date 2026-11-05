import { ExplorerTracker } from "@/components/features/ExplorerTracker";

export const metadata = {
  title: "এক্সপ্লোরার লিডারবোর্ড — ভাইবম্যাপ",
  description: "ঘোরা জেলা মার্ক করে র‍্যাংক, মেডেল ও ১০৮০×১০৮০ JPG পোস্টার নাও।",
};

export default function ExplorerPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          🏆 এলিট এক্সপ্লোরার লিডারবোর্ড
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          বামে একটাই লাইভ ম্যাপ → ডানে জেলা সিলেক্ট করো → JPG ডাউনলোড করো
        </p>
      </header>
      {/* Single-map studio: interactive map + selector + photo + JPG export live together.
          No second visible map — the 1080 poster node is hidden off-screen for export only. */}
      <ExplorerTracker />
    </div>
  );
}
