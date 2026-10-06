import { GamesTracker } from "@/components/features/GamesTracker";
import { AvatarCard } from "@/components/studio/AvatarCard";
import { PosterSection } from "@/components/poster/PosterSection";

export const metadata = {
  title: "খেলাধুলা ম্যাপ — ম্যাপভাইব",
  description: "ছোটবেলার খেলা সিলেক্ট করে ১০৮০×১০৮০ পোস্টার বানাও।",
};

export default function GamesPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          🪁 ছোটবেলার খেলাধুলা ম্যাপ
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          খেলা সিলেক্ট করো → নতুন খেলা যোগ করো → ছবি দাও → পোস্টার ডাউনলোড করো
        </p>
      </header>
      <GamesTracker />
      <AvatarCard />
      <PosterSection tab="games" />
    </div>
  );
}
