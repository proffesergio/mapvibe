import { BdFlag } from "@/components/ui/BdFlag";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8 dark:border-white/10">
      <div className="mx-auto w-full max-w-5xl px-4 text-center">
        <p className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <BdFlag size={22} /> ম্যাপভাইব — আপনার ছবি আপনার ফোনেই থাকে
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          ছবি ডাউনলোড করে ফেসবুক ওয়াল / স্টোরিতে পোস্ট করুন। Made for viral Bangla sharing.
        </p>
      </div>
    </footer>
  );
}
