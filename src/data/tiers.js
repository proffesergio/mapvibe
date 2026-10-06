/** Feature 4: leaderboard rank tiers. */
export const LEADERBOARD_TIERS = [
  { minCount: 0, maxCount: 5, title: "নবিশ ট্যুরিস্ট", badgeEmoji: "🌱", borderColor: "border-green-500" },
  { minCount: 6, maxCount: 15, title: "ঘুরে বেড়ানো যাযাবর", badgeEmoji: "🎒", borderColor: "border-blue-500" },
  { minCount: 16, maxCount: 35, title: "প্রো অভিযাত্রী", badgeEmoji: "🗺️", borderColor: "border-purple-500" },
  { minCount: 36, maxCount: 63, title: "এলিট এক্সপ্লোরার", badgeEmoji: "👑", borderColor: "border-amber-500" },
  { minCount: 64, maxCount: 64, title: "বাংলাদেশ জয়ের নায়ক", badgeEmoji: "🚩", borderColor: "border-red-600" },
];

export const FEATURE_TABS = [
  { id: "slang", label: "ভাষা ম্যাপ", emoji: "🗣️", headline: "আঞ্চলিক ভাষা ম্যাপ", path: "/slang", desc: "নিজের এলাকার ভাষা যোগ করো, ম্যাপে জেলা জ্বলবে।" },
  { id: "nostalgia", label: "নস্টালজিয়া", emoji: "📼", headline: "নস্টালজিয়া ম্যাপ", path: "/nostalgia", desc: "দশক + স্মৃতি + শৈশবের জেলা দিয়ে গল্প-পোস্টার বানাও।" },
  { id: "games", label: "খেলাধুলা", emoji: "🪁", headline: "ছোটবেলার খেলাধুলা ম্যাপ", path: "/games", desc: "কানামাছি থেকে গোল্লাছুট — খেলার ব্যাজ নাও।" },
  { id: "explorer", label: "এক্সপ্লোরার", emoji: "🏆", headline: "এলিট এক্সপ্লোরার লিডারবোর্ড", path: "/explorer", desc: "ঘোরা জেলা মার্ক করে র‍্যাংক ও মেডেল জেতো।" },
];

export const FLOW_STEPS = [
  { no: 1, title: "থিম বেছে নিন", desc: "উপরের ট্যাব থেকে" },
  { no: 2, title: "ম্যাপে পিক করুন", desc: "চেকলিস্টে ক্লিক" },
  { no: 3, title: "ছবি দিন", desc: "আপলোড / ওয়েবক্যাম" },
  { no: 4, title: "ডাউনলোড করুন", desc: "১০৮০×১০৮০ শেয়ার" },
];
