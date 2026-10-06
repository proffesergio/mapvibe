import { NostalgiaPicker } from "@/components/features/NostalgiaPicker";
import { AvatarCard } from "@/components/studio/AvatarCard";
import { PosterSection } from "@/components/poster/PosterSection";

export const metadata = {
  title: "নস্টালজিয়া ম্যাপ — ম্যাপভাইব",
  description: "দশক, স্মৃতি ও শৈশবের জেলা বেছে রেট্রো পোস্টার বানাও।",
};

export default function NostalgiaPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          📼 নস্টালজিয়া ম্যাপ
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          দশক + মনে-পড়া মুহূর্ত + শৈশবের জেলা → তোমার গল্পসহ পোস্টার
        </p>
      </header>
      <NostalgiaPicker />
      <AvatarCard />
      <PosterSection tab="nostalgia" />
    </div>
  );
}
