/** Feature 2+3: childhood games + decade aesthetics + nostalgia memory deck. */
export const GAMES = [
  { id: "g1", name: "কানামাছি ভোঁ ভোঁ" },
  { id: "g2", name: "দাড়িয়াবান্ধা" },
  { id: "g3", name: "কুতকুত / বৌচি" },
  { id: "g4", name: "লাটিম ও মার্বেল" },
  { id: "g5", name: "কাগজের নৌকা ভাসানো" },
  { id: "g6", name: "লুকোচুরি (চোর-পুলিশ)" },
  { id: "g7", name: "ক্রিকেট ও ব্যাডমিন্টন" },
  { id: "g8", name: "গোল্লাছুট" },
  { id: "g9", name: "নদীতে সাঁতার ও দৌড়ঝাঁপ" },
  { id: "g10", name: "বউ-ছি" },
];

export const DECADES = [
  {
    id: "80s",
    label: "৮০ দশক",
    themeName: "৮০ দশকের সাদা-কালো বিটিভি",
    style: "bg-[#e8e4da] text-[#3a3a32]",
    sticker: "📺 বিটিভি সাদা-কালো যুগ",
    hint: "ডিশ আসার আগে — ছাদে অ্যান্টেনা, শুক্রবারে সিনেমা",
  },
  {
    id: "90s",
    label: "৯০ দশক",
    themeName: "৯০ দশকের রঙিন ক্যাসেট",
    style: "bg-[#f4ebe1] text-[#4a3728]",
    sticker: "📼 BTV সোনালি যুগ",
    hint: "আলিফ লায়লা, মীনা, ক্যাসেটে গান, লোডশেডিংয়ে হারিকেন",
  },
  {
    id: "2000s",
    label: "২০০০ দশক",
    themeName: "২০০০ দশকের সিডি ও রেডিও",
    style: "bg-[#e8f0fe] text-[#1a237e]",
    sticker: "📻 রেডিও ফুর্তি",
    hint: "ডিশ লাইন, সিডি/ভিসিডি, নোকিয়া, ঈদে চাঁদরাত",
  },
  {
    id: "2010s",
    label: "২০১০ দশক",
    themeName: "২০১০ দশকের ফেসবুক ও মেমোরিজ",
    style: "bg-[#111827] text-[#f9fafb]",
    sticker: "📱 আর্লি অ্যান্ড্রয়েড",
    hint: "ফেসবুক, স্মার্টফোন, ইউটিউব, কোচিং-স্কুল স্মৃতি",
  },
];

export const MEMORY_CATS = {
  tv: "📺 টিভি ও শব্দ",
  food: "🍬 খাবার",
  ritual: "🌙 উৎসব ও রীতি",
  object: "📻 জিনিস",
  place: "🏡 জায়গা",
};

/** "মনে পড়ে?" emotion deck — tap what you lived. Shown on the poster. */
export const NOSTALGIA_MEMORIES = [
  { id: "m-btv", emoji: "📺", label: "বিটিভি উদ্বোধনী সুর", cat: "tv", hint: "বিকেলে জাতীয় সংগীত দিয়ে শুরু" },
  { id: "m-alif", emoji: "🧞", label: "শুক্রবারে আলিফ লায়লা", cat: "tv", hint: "সবাই মিলে টিভির সামনে" },
  { id: "m-meena", emoji: "👧", label: "মীনা-রাজু কার্টুন", cat: "tv", hint: "স্কুলে মীনা দিবস" },
  { id: "m-shaktiman", emoji: "💪", label: "শক্তিমানের অপেক্ষা", cat: "tv", hint: "রবিবার দুপুর" },
  { id: "m-cassette", emoji: "📼", label: "কলমে ক্যাসেট রিওয়াইন্ড", cat: "object", hint: "প্রিয় গান আটকে গেলে" },
  { id: "m-load", emoji: "🪔", label: "লোডশেডিং + হারিকেন", cat: "object", hint: "গরমে ছাদে হাওয়া" },
  { id: "m-antenna", emoji: "📡", label: "ছাদে অ্যান্টেনা ঘোরানো", cat: "object", hint: "“আরেকটু… ঝকঝকে!”" },
  { id: "m-radio", emoji: "📻", label: "রেডিওতে অনুরোধের আসর", cat: "tv", hint: "প্রিয় গানের অপেক্ষা" },
  { id: "m-nokia", emoji: "📱", label: "নোকিয়া + স্নেক গেম", cat: "object", hint: "টর্চলাইট ফোন" },
  { id: "m-salami", emoji: "🌙", label: "ঈদ সালামি জমানো", cat: "ritual", hint: "নতুন টাকার ঘ্রাণ" },
  { id: "m-mehendi", emoji: "🌜", label: "চাঁদরাতে মেহেদি", cat: "ritual", hint: "হাতে চাঁদ-তারা" },
  { id: "m-boishakh", emoji: "🎡", label: "বৈশাখী মেলা", cat: "ritual", hint: "নাগরদোলা + মাটির ব্যাংক" },
  { id: "m-jhalmuri", emoji: "🌶️", label: "স্কুলগেটের ঝালমুড়ি", cat: "food", hint: "আচার + চানাচুর" },
  { id: "m-hawai", emoji: "🍭", label: "হাওয়াই মিঠাই", cat: "food", hint: "গোলাপি মেঘ" },
  { id: "m-tiffin", emoji: "🍱", label: "টিফিন ভাগাভাগি", cat: "food", hint: "ডিম-আলুর ডিমভাজি" },
  { id: "m-pukur", emoji: "🏊", label: "পুকুরঘাটে দুপুর", cat: "place", hint: "ঝাঁপ + সাঁতার প্রতিযোগিতা" },
  { id: "m-dhan", emoji: "🌾", label: "ধানখেতে দৌড়", cat: "place", hint: "কাদায় ফুটবল" },
  { id: "m-launch", emoji: "🚢", label: "লঞ্চে দক্ষিণ যাত্রা", cat: "place", hint: "চাঁদনি রাতে ছাদে ঘুম" },
];

export function nostalgiaBadgeText(decadeLabel, districtName) {
  return `${decadeLabel}-এর অবাধ্য শৈশব কেটেছে ${districtName}-এ!`;
}

export function memoryBadgeText(count) {
  const bn = String(count).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
  return `মনে পড়ে! আমার ${bn}টি শৈশব-মুহূর্ত এখনো চোখে ভাসে।`;
}
