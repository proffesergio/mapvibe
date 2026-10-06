import { ExplorerTracker } from "@/components/features/ExplorerTracker";
import { AvatarCard } from "@/components/studio/AvatarCard";
import { PosterSection } from "@/components/poster/PosterSection";

export const metadata = {
  title: "এক্সপ্লোরার লিডারবোর্ড — ম্যাপভাইব",
  description: "ঘোরা জেলা মার্ক করে র‍্যাংক, মেডেল ও ১০৮০×১০৮০ পোস্টার নাও।",
};

export default function ExplorerPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          🏆 এলিট এক্সপ্লোরার লিডারবোর্ড
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          ঘোরা জেলা মার্ক করো → র‍্যাংক দেখো → ছবি দাও → পোস্টার ডাউনলোড করো
        </p>
      </header>
      <ExplorerTracker />
      <AvatarCard />
      <PosterSection tab="explorer" />
    </div>
  );
}
