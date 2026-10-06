/** Feature 1: regional slang mapped to highlight zones. */
export const SLANGS = [
  { id: "s1", phrase: "উড়া ধুরা", meaning: "চরম / পাগলাটে", regionId: "dhaka" },
  { id: "s2", phrase: "হ্যারিকেন ধরানো", meaning: "বড় বিপদে পড়া", regionId: "dhaka" },
  { id: "s3", phrase: "বেগুনী (হ্যাঁ/না টান)", meaning: "কুমিল্লার আঞ্চলিক টান", regionId: "cumilla" },
  { id: "s4", phrase: "ক্যাঁতাশ / হাতাশ", meaning: "বিরক্তির অভিব্যক্তি", regionId: "noakhali" },
  { id: "s5", phrase: "মেইল্লা দিউম / থেঁতলাই দিউম", meaning: "মজার ভয় দেখানো", regionId: "chattogram" },
  { id: "s6", phrase: "বাইসাব / পুরী", meaning: "ভাই / মেয়ে", regionId: "sylhet" },
  { id: "s7", phrase: "হামাকেরে / তুমাকেরে", meaning: "আমাদের / তোমাদের", regionId: "bogura" },
  { id: "s8", phrase: "মুই কি হনুরে", meaning: "আমি কী ভাবি নিজেকে?", regionId: "barishal" },
  { id: "s9", phrase: "আঁই জ্যান্তো মানুষ!", meaning: "আমি জলজ্যান্ত মানুষ!", regionId: "noakhali" },
  { id: "s10", phrase: "খাওন-দাওন উরাধুরা", meaning: "জম্পেশ ভোজ", regionId: "dhaka" },
  { id: "s11", phrase: "বেইন্নালা", meaning: "সকাল (ব্রাহ্মণবাড়িয়া)", regionId: "brahmanbaria" },
  { id: "s12", phrase: "হাইঞ্জালা", meaning: "সন্ধ্যা (ব্রাহ্মণবাড়িয়া)", regionId: "brahmanbaria" },
];

export function slangBadgeText(count) {
  const bn = String(count).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
  return `সার্টিফাইড ভাষা যাযাবর! আমি ${bn}টি আঞ্চলিক ভাষা বুঝি।`;
}
