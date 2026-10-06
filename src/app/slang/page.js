import { SlangTracker } from "@/components/features/SlangTracker";
import { AvatarCard } from "@/components/studio/AvatarCard";
import { PosterSection } from "@/components/poster/PosterSection";

export const metadata = {
  title: "ভাষা ম্যাপ — ম্যাপভাইব",
  description: "আঞ্চলিক ভাষা যোগ করো, ম্যাপে দেখো, পোস্টার ডাউনলোড করো।",
};

export default function SlangPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          🗣️ আঞ্চলিক ভাষা ম্যাপ
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          ভাষা বেছে নাও বা নতুনটা যোগ করো → ম্যাপে জেলা ভরবে → পোস্টার ডাউনলোড করো
        </p>
      </header>
      <SlangTracker />
      <AvatarCard />
      <PosterSection tab="slang" />
    </div>
  );
}
