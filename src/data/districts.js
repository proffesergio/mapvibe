/**
 * 64 districts grouped by division.
 * Source: mapvibe_dataset.md — ids are stable hooks for the SVG map.
 */
export const DISTRICTS = [
  { id: "dhaka", name: "ঢাকা", division: "Dhaka" },
  { id: "gazipur", name: "গাজীপুর", division: "Dhaka" },
  { id: "narayanganj", name: "নারায়ণগঞ্জ", division: "Dhaka" },
  { id: "tangail", name: "টাঙ্গাইল", division: "Dhaka" },
  { id: "faridpur", name: "ফরিদপুর", division: "Dhaka" },
  { id: "manikganj", name: "মানিকগঞ্জ", division: "Dhaka" },
  { id: "munshiganj", name: "মুন্সীগঞ্জ", division: "Dhaka" },
  { id: "narsingdi", name: "নরসিংদী", division: "Dhaka" },
  { id: "gopalganj", name: "গোপালগঞ্জ", division: "Dhaka" },
  { id: "madaripur", name: "মাদারীপুর", division: "Dhaka" },
  { id: "rajbari", name: "রাজবাড়ী", division: "Dhaka" },
  { id: "shariatpur", name: "শরীয়তপুর", division: "Dhaka" },
  { id: "kishoreganj", name: "কিশোরগঞ্জ", division: "Dhaka" },

  { id: "chattogram", name: "চট্টগ্রাম", division: "Chattogram" },
  { id: "coxsbazar", name: "কক্সবাজার", division: "Chattogram" },
  { id: "cumilla", name: "কুমিল্লা", division: "Chattogram" },
  { id: "feni", name: "ফেনী", division: "Chattogram" },
  { id: "brahmanbaria", name: "ব্রাহ্মণবাড়িয়া", division: "Chattogram" },
  { id: "noakhali", name: "নোয়াখালী", division: "Chattogram" },
  { id: "lakshmipur", name: "লক্ষ্মীপুর", division: "Chattogram" },
  { id: "chandpur", name: "চাঁদপুর", division: "Chattogram" },
  { id: "khagrachhari", name: "খাগড়াছড়ি", division: "Chattogram" },
  { id: "rangamati", name: "রাঙ্গামাটি", division: "Chattogram" },
  { id: "bandarban", name: "বান্দরবান", division: "Chattogram" },

  { id: "sylhet", name: "সিলেট", division: "Sylhet" },
  { id: "moulvibazar", name: "মৌলভীবাজার", division: "Sylhet" },
  { id: "habiganj", name: "হবিগঞ্জ", division: "Sylhet" },
  { id: "sunamganj", name: "সুনামগঞ্জ", division: "Sylhet" },

  { id: "khulna", name: "খুলনা", division: "Khulna" },
  { id: "jashore", name: "যশোর", division: "Khulna" },
  { id: "satkhira", name: "সাতক্ষীরা", division: "Khulna" },
  { id: "bagerhat", name: "বাগেরহাট", division: "Khulna" },
  { id: "kushtia", name: "কুষ্টিয়া", division: "Khulna" },
  { id: "magura", name: "মাগুরা", division: "Khulna" },
  { id: "meherpur", name: "মেহেরপুর", division: "Khulna" },
  { id: "narail", name: "নড়াইল", division: "Khulna" },
  { id: "chuadanga", name: "চুয়াডাঙ্গা", division: "Khulna" },
  { id: "jhenaidah", name: "ঝিনাইদহ", division: "Khulna" },

  { id: "barishal", name: "বরিশাল", division: "Barishal" },
  { id: "bhola", name: "ভোলা", division: "Barishal" },
  { id: "patuakhali", name: "পটুয়াখালী", division: "Barishal" },
  { id: "pirojpur", name: "পিরোজপুর", division: "Barishal" },
  { id: "jhalokathi", name: "ঝালকাঠি", division: "Barishal" },
  { id: "barguna", name: "বরগুনা", division: "Barishal" },

  { id: "rajshahi", name: "রাজশাহী", division: "Rajshahi" },
  { id: "bogura", name: "বগুড়া", division: "Rajshahi" },
  { id: "pabna", name: "পাবনা", division: "Rajshahi" },
  { id: "naogaon", name: "নওগাঁ", division: "Rajshahi" },
  { id: "sirajganj", name: "সিরাজগঞ্জ", division: "Rajshahi" },
  { id: "natore", name: "নাটোর", division: "Rajshahi" },
  { id: "joypurhat", name: "জয়পুরহাট", division: "Rajshahi" },
  { id: "chapainawabganj", name: "চাঁপাইনবাবগঞ্জ", division: "Rajshahi" },

  { id: "rangpur", name: "রংপুর", division: "Rangpur" },
  { id: "dinajpur", name: "দিনাজপুর", division: "Rangpur" },
  { id: "gaibandha", name: "গাইবান্ধা", division: "Rangpur" },
  { id: "kurigram", name: "কুড়িগ্রাম", division: "Rangpur" },
  { id: "lalmonirhat", name: "লালমনিরহাট", division: "Rangpur" },
  { id: "nilphamari", name: "নীলফামারী", division: "Rangpur" },
  { id: "panchagarh", name: "পঞ্চগড়", division: "Rangpur" },
  { id: "thakurgaon", name: "ঠাকুরগাঁও", division: "Rangpur" },

  { id: "mymensingh", name: "ময়মনসিংহ", division: "Mymensingh" },
  { id: "jamalpur", name: "জামালপুর", division: "Mymensingh" },
  { id: "netrokona", name: "নেত্রকোণা", division: "Mymensingh" },
  { id: "sherpur", name: "শেরপুর", division: "Mymensingh" },
];

export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Barishal",
  "Rajshahi",
  "Rangpur",
  "Mymensingh",
];

export const DIVISION_BN = {
  Dhaka: "ঢাকা",
  Chattogram: "চট্টগ্রাম",
  Sylhet: "সিলেট",
  Khulna: "খুলনা",
  Barishal: "বরিশাল",
  Rajshahi: "রাজশাহী",
  Rangpur: "রংপুর",
  Mymensingh: "ময়মনসিংহ",
};

export const districtById = (id) => DISTRICTS.find((d) => d.id === id);
