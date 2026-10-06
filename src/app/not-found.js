import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-16 text-center">
      <p className="text-6xl" aria-hidden>
        🗺️
      </p>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">পথ হারিয়ে গেছো?</h1>
      <p className="text-slate-600 dark:text-slate-300">
        এই ঠিকানায় কোনো পেজ নেই। হোমে ফিরে নতুন পোস্টার বানাও!
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center rounded-2xl bg-indigo-600 px-8 font-bold text-white"
      >
        🏠 হোমে ফিরো
      </Link>
    </div>
  );
}
