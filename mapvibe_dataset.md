# MapVibe (ম্যাপভাইব) Static Asset & Dataset Reference Document
This document contains the optimized, raw JSON arrays of regional slang, childhood elements, and districts to be copy-pasted directly into the Next.js/Tailwind source files during vibe coding.

---

## 🗺️ 1. BANGLADESH DISTRICTS REFERENCE LIST (64 Districts by Division)
Use this clean mapping array for both the Interactive Checklist and the SVG Map path data hooks.

```json
[
  { "id": "dhaka", "name": "ঢাকা", "division": "Dhaka" },
  { "id": "gazipur", "name": "গাজীপুর", "division": "Dhaka" },
  { "id": "narayanganj", "name": "নারায়ণগঞ্জ", "division": "Dhaka" },
  { "id": "tangail", "name": "টাঙ্গাইল", "division": "Dhaka" },
  { "id": "faridpur", "name": "ফরিদপুর", "division": "Dhaka" },
  { "id": "manikganj", "name": "মানিকগঞ্জ", "division": "Dhaka" },
  { "id": "munshiganj", "name": "মুন্সীগঞ্জ", "division": "Dhaka" },
  { "id": "narsingdi", "name": "নরসিংদী", "division": "Dhaka" },
  { "id": "gopalganj", "name": "গোপালগঞ্জ", "division": "Dhaka" },
  { "id": "madaripur", "name": "মাদারীপুর", "division": "Dhaka" },
  { "id": "rajbari", "name": "রাজবাড়ী", "division": "Dhaka" },
  { "id": "shariatpur", "name": "শরীয়তপুর", "division": "Dhaka" },
  { "id": "kishoreganj", "name": "কিশোরগঞ্জ", "division": "Dhaka" },
  
  { "id": "chattogram", "name": "চট্টগ্রাম", "division": "Chattogram" },
  { "id": "coxsbazar", "name": "কক্সবাজার", "division": "Chattogram" },
  { "id": "cumilla", "name": "কুমিল্লা", "division": "Chattogram" },
  { "id": "feni", "name": "ফেনী", "division": "Chattogram" },
  { "id": "brahmanbaria", "name": "ব্রাহ্মণবাড়িয়া", "division": "Chattogram" },
  { "id": "noakhali", "name": "নোয়াখালী", "division": "Chattogram" },
  { "id": "lakshmipur", "name": "লক্ষ্মীপুর", "division": "Chattogram" },
  { "id": "chandpur", "name": "চাঁদপুর", "division": "Chattogram" },
  { "id": "khagrachhari", "name": "খাগড়াছড়ি", "division": "Chattogram" },
  { "id": "rangamati", "name": "রাঙ্গামাটি", "division": "Chattogram" },
  { "id": "bandarban", "name": "বান্দরবান", "division": "Chattogram" },

  { "id": "sylhet", "name": "সিলেট", "division": "Sylhet" },
  { "id": "moulvibazar", "name": "মৌলভীবাজার", "division": "Sylhet" },
  { "id": "habiganj", "name": "হবিগঞ্জ", "division": "Sylhet" },
  { "id": "sunamganj", "name": "সুনামগঞ্জ", "division": "Sylhet" },

  { "id": "khulna", "name": "খুলনা", "division": "Khulna" },
  { "id": "jashore", "name": "যশোর", "division": "Khulna" },
  { "id": "satkhira", "name": "সাতক্ষীরা", "division": "Khulna" },
  { "id": "bagerhat", "name": "বাগেরহাট", "division": "Khulna" },
  { "id": "kushtia", "name": "কুষ্টিয়া", "division": "Khulna" },
  { "id": "magura", "name": "মাগুরা", "division": "Khulna" },
  { "id": "meherpur", "name": "মেহেরপুর", "division": "Khulna" },
  { "id": "narail", "name": "নড়াইল", "division": "Khulna" },
  { "id": "chuadanga", "name": "চুয়াডাঙ্গা", "division": "Khulna" },
  { "id": "jhenaidah", "name": "ঝিনাইদহ", "division": "Khulna" },

  { "id": "barishal", "name": "বরিশাল", "division": "Barishal" },
  { "id": "bhola", "name": "ভোলা", "division": "Barishal" },
  { "id": "patuakhali", "name": "পটুয়াখালী", "division": "Barishal" },
  { "id": "pirojpur", "name": "পিরোজপুর", "division": "Barishal" },
  { "id": "jhalokathi", "name": "ঝালকাঠি", "division": "Barishal" },
  { "id": "barguna", "name": "বরগুনা", "division": "Barishal" },

  { "id": "rajshahi", "name": "রাজশাহী", "division": "Rajshahi" },
  { "id": "bogura", "name": "বগুড়া", "division": "Rajshahi" },
  { "id": "pabna", "name": "পাবনা", "division": "Rajshahi" },
  { "id": "naogaon", "name": "নওগাঁ", "division": "Rajshahi" },
  { "id": "sirajganj", "name": "সিরাজগঞ্জ", "division": "Rajshahi" },
  { "id": "natore", "name": "নাটোর", "division": "Rajshahi" },
  { "id": "joypurhat", "name": "জয়পুরহাট", "division": "Rajshahi" },
  { "id": "chapainawabganj", "name": "চাঁপাইনবাবগঞ্জ", "division": "Rajshahi" },

  { "id": "rangpur", "name": "রংপুর", "division": "Rangpur" },
  { "id": "dinajpur", "name": "দিনাজপুর", "division": "Rangpur" },
  { "id": "gaibandha", "name": "গাইবান্ধা", "division": "Rangpur" },
  { "id": "kurigram", "name": "কুড়িগ্রাম", "division": "Rangpur" },
  { "id": "lalmonirhat", "name": "লালমনিরহাট", "division": "Rangpur" },
  { "id": "nilphamari", "name": "নীলফামারী", "division": "Rangpur" },
  { "id": "panchagarh", "name": "পঞ্চগড়", "division": "Rangpur" },
  { "id": "thakurgaon", "name": "ঠাকুরগাঁও", "division": "Rangpur" },

  { "id": "mymensingh", "name": "ময়মনসিংহ", "division": "Mymensingh" },
  { "id": "jamalpur", "name": "জামালপুর", "division": "Mymensingh" },
  { "id": "netrokona", "name": "নেত্রকোনা", "division": "Mymensingh" },
  { "id": "sherpur", "name": "শেরপুর", "division": "Mymensingh" }
]
```

---

## 🗣️ 2. FEATURE 1 DATASET: REGIONAL SLANG & ACCENTS
High-impact, funny, and hyper-localized phrases mapped to target highlight zones.

```json
[
  { "id": "s1", "phrase": "উড়া ধুরা", "meaning": "Extreme / Insane", "regionId": "dhaka" },
  { "id": "s2", "phrase": "হ্যারিকেন ধরানো", "meaning": "Getting into huge trouble", "regionId": "dhaka" },
  { "id": "s3", "phrase": "বেগুনী (Han/Ngo)", "meaning": "Yes/No regional tone", "regionId": "cumilla" },
  { "id": "s4", "phrase": "ক্যাঁতাশ / হাতাশ", "meaning": "Exasperated expression", "regionId": "noakhali" },
  { "id": "s5", "phrase": "মেইল্লা দিউম / থেঁতলাই দিউম", "meaning": "Playful threat of beating", "regionId": "chattogram" },
  { "id": "s6", "phrase": "বাইসাব / পুরী", "meaning": "Brother / Girl", "regionId": "sylhet" },
  { "id": "s7", "phrase": "হামাকেরে / তুমাকেরে", "meaning": "Ours / Yours", "regionId": "bogura" },
  { "id": "s8", "phrase": "মুই কি হনুরে", "meaning": "Who do I think I am?", "regionId": "barishal" },
  { "id": "s9", "phrase": "আঁই জ্যান্তো মানুষ!", "meaning": "I am a living soul!", "regionId": "noakhali" },
  { "id": "s10", "phrase": "খাওন-দাওন উরাধুরা", "meaning": "Crazy heavy feasting", "regionId": "old_dhaka" }
]
```

---

## 📻 3. FEATURE 2 DATASET: NOSTALGIA & CHILDHOOD MEMORIES
Vintage 90s/2000s themes to evoke emotional sharing loop.

### A. Childhood Games Checklist
```json
[
  { "id": "g1", "name": "কানামাছি ভো ভো" },
  { "id": "g2", "name": "দাড়িয়াবান্ধা" },
  { "id": "g3", "name": "কুতকুত বৌচি" },
  { "id": "g4", "name": "লাটিম ও মার্বেল খেলন" },
  { "id": "g5", "name": "কাগজের নৌকা ভাসানো" },
  { "id": "g6", "name": "লুকোচুরি (চোর-পুলিশ)" },
  { "id": "g7", "name": "ক্রিকেট ও ফুলকোর্ট ব্যাডমিন্টন" }
]
```

### B. Decade Aesthetic Profiles
```json
[
  {
    "decade": "90s",
    "themeName": "৯০ দশকের রঙিন ক্যাসেট",
    "style": "bg-[#f4ebe1] text-[#4a3728] border-sepia",
    "sticker": "📼 BTV Golden Era"
  },
  {
    "decade": "2000s",
    "themeName": "২০০০ দশকের সিডি ক্যাসেট ও রেডিও",
    "style": "bg-[#e8f0fe] text-[#1a237e] border-blue",
    "sticker": "📻 Radio Foorti Waves"
  },
  {
    "decade": "2010s",
    "themeName": "২০১০ দশকের ফেসবুক ও মেমোরিজ",
    "style": "bg-[#111827] text-[#f9fafb] border-slate",
    "sticker": "📱 Early Android Vibes"
  }
]
```

---

## 🏆 4. FEATURE 3 DATASET: LEADERBOARD STRATIFICATION
Logic matrix to calculate ranks instantly inside the Canvas Render block without external state calls.

```typescript
export interface RankTier {
  minCount: number;
  maxCount: number;
  title: string;
  badgeEmoji: string;
  borderColor: string;
}

export const LEADERBOARD_TIERS: RankTier[] = [
  { "minCount": 0, "maxCount": 5, "title": "নবিশ ট্যুরিস্ট (Rookie Traveller)", "badgeEmoji": "🌱", "borderColor": "border-green-500" },
  { "minCount": 6, "maxCount": 15, "title": "ঘুরে বেড়ানো যাযাবর (Wanderer)", "badgeEmoji": "🎒", "borderColor": "border-blue-500" },
  { "minCount": 16, "maxCount": 35, "title": "প্রো অভিযাত্রী (Pro Backpacker)", "badgeEmoji": "🗺️", "borderColor": "border-purple-500" },
  { "minCount": 36, "maxCount": 63, "title": "এলিট এক্সপ্লোরার (Elite Explorer)", "badgeEmoji": "👑", "borderColor": "border-amber-500" },
  { "minCount": 64, "maxCount": 64, "title": "বাংলাদেশ জয়ের নায়ক (Ultimate Conqueror)", "badgeEmoji": "🚩", "borderColor": "border-red-600 animate-pulse" }
];
```
