# VibeMap · ভাইবম্যাপ

A public directory of apps, websites and digital products built across Bangladesh’s 64 districts. Next.js 16, React 19, Tailwind 4 and Neon Postgres.

## Directory

Submit a project with a public URL, description, district, category and tech stack. Successful Neon writes immediately appear in the client directory. The SVG uses the existing district boundary dataset and its projected district anchors; these are district-level representative positions, not developer GPS coordinates. Multiple projects share a district pin with a count and a selectable project list.

Search, category, district, stack and Carbon Copy filters run on the server with cursor pagination (50 records maximum per page). The map represents loaded results; load more to extend it. Category and stack groups generate a bounded graph of up to 100 connections, avoiding quadratic comparisons or external AI calls. Mobile layouts, native keyboard-accessible dialogs, visible focus states and reduced-motion support are included.

Carbon Copy is an automated similarity hint, not an accusation. Up to 200 recent same-category projects are compared using normalized name and description token overlap. Evidence includes the matched project and similarity scores. Paraphrases, older projects outside that window and cross-category copies may be missed. Canonical URLs have a database uniqueness constraint.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your Neon connection string.
3. Run `scripts/neon-tools-schema.sql` once in the Neon SQL Editor. This additive migration leaves existing slang tables intact.
4. Use `npm run dev` when your machine has capacity. `npm test` runs lightweight pure backend checks.

Without Neon, the directory explicitly reports offline and submissions return HTTP 503. No fake public submissions or temporary in-memory database are used.

## Deployment and repository migration

Attach **vibemap.vercel.app** and **vibemapbd.vercel.app** to the same Vercel project. APIs and asset URLs are relative, so both aliases use the same Neon database without CORS configuration. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to your chosen primary domain. OAuth providers must allow that primary origin’s `/api/auth/callback/<provider>` URL; sign-in sessions remain origin scoped.

The supplied replacement repository URL (`https://github.com`) is a host, not a repository destination. No remote is invented or changed. After creating the destination repository, update the Git remote and reconnect the Vercel Git integration to its actual URL. The `vibemapbd.vercel.app` alias is attached to the existing Vercel project. `vibemap.vercel.app` is already in use and could not be claimed. The default primary URL is `https://vibemapbd.vercel.app`. OAuth settings and database migration have not been applied remotely.

## Verification and design status

Backend unit tests and source syntax checks are lightweight. Production build and browser/visual checks are intentionally deferred at the user’s request to avoid machine crashes. No local servers are required for these checks. The responsive directory uses a dark forest/mint system with CSS perspective, hover depth and lightweight pin animation. 12ui candidates were generated and inspected; pixel-aligned conversion and Superdesign draft completion are not verified after interrupted sessions.

Legacy poster, language, games, nostalgia and explorer routes remain accessible from the navigation/footer. The dataset reference is `vibemap_dataset.md`.

---

<details><summary>Legacy poster documentation</summary>

<div align="center">

# 🗺️ ভাইবম্যাপ — VibeMap

### নিজের এলাকার ভাষা, শৈশবের স্মৃতি আর ঘোরা জেলা —<br/>১ মিনিটে সুন্দর বাংলাদেশ ম্যাপ পোস্টার বানাও, ফেসবুকে শেয়ার করো

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Neon](https://img.shields.io/badge/Postgres-Neon-00e699)
![Bangla First](https://img.shields.io/badge/Bangla-First-green)

**🗣️ ভাষা ম্যাপ &nbsp;·&nbsp; 📼 নস্টালজিয়া &nbsp;·&nbsp; 🪁 খেলাধুলা &nbsp;·&nbsp; 🏆 এক্সপ্লোরার**

</div>

---

## ভাইবম্যাপ কী?

ভাইবম্যাপ একটা ইন্টার‌্যাক্টিভ বাংলাদেশ ম্যাপ পোস্টার মেকার। থিম বেছে নাও, ম্যাপে ট্যাপ করো, নিজের ছবি দাও — সুন্দর একটা পোস্টার তৈরি হয়ে যাবে, যেটা ডাউনলোড করে ফেসবুক ওয়াল বা স্টোরিতে দিতে পারো।

কোনো অ্যাকাউন্ট লাগে না। তোমার ছবি তোমার ফোনেই থাকে।

---

## ✨ ৪টা ম্যাপ, ৪ রকম আনন্দ

| ম্যাপ | তুমি যা করবে | পোস্টারে যা পাবে |
|---|---|---|
| 🗣️ **ভাষা ম্যাপ** | এলাকার ভাষা খুঁজো, ভালো লাগলে ভোট দাও, নিজের এলাকার নতুন ভাষা যোগ করো | তোমার পিক করা **সব ভাষা** + উৎপত্তি জেলাগুলো রঙিন ম্যাপে |
| 📼 **নস্টালজিয়া** | দশক বেছে নাও, "মনে পড়ে?" কার্ডে ট্যাপ করো, ১ লাইনের গল্প লেখো | তোমার দশকের থিম + শৈশবের জেলা + স্মৃতি + তোমার গল্প |
| 🪁 **খেলাধুলা** | ছোটবেলায় যা যা খেলেছো সিলেক্ট করো | "আসল ৯০s কিড!" স্টাইলের খেলার ব্যাজ |
| 🏆 **এক্সপ্লোরার** | কোন কোন জেলায় ঘুরেছো মার্ক করো | ঘোরার সংখ্যা অনুযায়ী র‍্যাংক — নবিশ থেকে এলিট এক্সপ্লোরার |

---

## 🚀 ইউজার হিসেবে যেভাবে ব্যবহার করবে

### ধাপ ১ — থিম বেছে নাও
হোমপেজ থেকে ৪টা কার্ডের যেকোনো একটায় ঢোকো: ভাষা, নস্টালজিয়া, খেলাধুলা বা এক্সপ্লোরার।

### ধাপ ২ — ম্যাপে ট্যাপ করো
- **ভাষা:** পছন্দের ভাষা কার্ডে ট্যাপ করলেই পাশের ম্যাপে জেলা জ্বলে উঠবে
- **নস্টালজিয়া:** দশক → স্মৃতি কার্ড → শৈশবের জেলা
- **খেলাধুলা / এক্সপ্লোরার:** চেকলিস্ট বা ম্যাপে সরাসরি ট্যাপ

### ধাপ ৩ — ছবি দাও (ঐচ্ছিক)
নিজের ছবি আপলোড করো — পোস্টারে গোল ফ্রেমে বসে যাবে। ছবি না দিলেও পোস্টার হবে।

### ধাপ ৪ — ডাউনলোড ও শেয়ার
নিচে লাইভ প্রিভিউ দেখে ফরম্যাট বেছে নাও — **🖼️ PNG** (সেরা কোয়ালিটি), **📷 JPG** (ছোট ফাইল, মেসেঞ্জারে পাঠাতে সুবিধা), **📄 PDF** (প্রিন্ট/আর্কাইভ) → গ্যালারিতে সেভ হবে → ফেসবুকে পোস্ট করো। ক্যাপশন কপি করার বাটনও আছে।

---

## 🗣️ ভাষা ম্যাপে নতুন ভাষা যোগ করা

তোমার এলাকার কোনো শব্দ, বাক্য বা স্ল্যাং মিসিং? নিজেই যোগ করো — সঙ্গে সঙ্গে সবার তালিকায় চলে যাবে।

1. **বিভাগ** বেছে নাও (যেমন: চট্টগ্রাম)
2. **জেলা** বেছে নাও (যেমন: নোয়াখালী)
3. **উপজেলা** বেছে নাও ড্রপডাউন থেকে (সব ৪৯৫টি উপজেলা আছে)
4. **স্থানীয় ভাষা** লেখো (যেমন: `আঁই জ্যান্তো মানুষ!`)
5. **প্রমিত বাংলায় অর্থ** লেখো (যেমন: `আমি জলজ্যান্ত মানুষ!`)
6. চাইলে একটা **উদাহরণ বাক্য** আর তোমার **নাম / ডাকনাম** দাও
7. **প্রকাশ করো** চাপো — done!

> ভালো এন্ট্রিতে **▲ ভোট** দাও — সেরাগুলো উপরে উঠে আসে।<br/>
> ভুল বা আপত্তিকর কিছু দেখলে **⚑ রিপোর্ট** করো — যাচাই করে সরিয়ে দেওয়া হয়।

---

## 📼 নস্টালজিয়া ম্যাপ — স্মৃতির টাইম-ট্রাভেল

এটা শুধু জেলা মার্ক করা না — ছোটবেলায় ফিরে যাওয়া।

1. **দশক বেছে নাও** — ৮০, ৯০, ২০০০ না ২০১০? প্রতিটা দশকের রঙ আর আমেজ আলাদা
2. **"মনে পড়ে?" কার্ডে ট্যাপ করো** — যেমন:
   - 📺 বিটিভি উদ্বোধনী সুর · 🧞 শুক্রবারের আলিফ লায়লা · 👧 মীনা-রাজু
   - 📼 কলমে ক্যাসেট রিওয়াইন্ড · 🪔 লোডশেডিং + হারিকেন · 📡 ছাদে অ্যান্টেনা ঘোরানো
   - 🌙 ঈদ সালামি · 🌜 চাঁদরাতে মেহেদি · 🌶️ স্কুলগেটের ঝালমুড়ি
   - 🏊 পুকুরঘাটে দুপুর · 🌾 ধানখেতে দৌড় · 🚢 লঞ্চে দক্ষিণ যাত্রা
3. **শৈশবের জেলা** মার্ক করো — যেখানে এই আনন্দগুলো পেয়েছো, সেই জেলাটাই ম্যাপে জ্বলবে
4. **১ লাইনের গল্প** লেখো (সর্বোচ্চ ১২০ অক্ষর) — যেমন: *"বৃষ্টির দিনে দাদার সাথে পুকুরে ঝাঁপ দিতাম…"*
5. পোস্টারে পাবে: দশকের থিম + রঙিন জেলা + তোমার স্মৃতি-ব্যাজ + তোমার গল্প

---

## 🖼️ পোস্টার নিয়ে

- প্রতিটা পোস্টার **স্কয়ার ফরম্যাটে** তৈরি — ফেসবুক ওয়াল আর স্টোরি দুটোতেই সুন্দর দেখায়
- ডার্ক মোডে সাইট ব্যবহার করলেও পোস্টারের রঙ বদলায় না — ডাউনলোডে সবসময় আসল থিম থাকে
- এক ডিভাইসে যা সিলেক্ট করবে, পরের বার এলে সেগুলো মনে থাকে

---

## 🛡️ প্রাইভেসি

- ছবি আপলোড করলে সেটা তোমার ব্রাউজারেই প্রসেস হয় — সার্ভারে ছবি জমা হয় না
- ভাষা ম্যাপে যা প্রকাশ করো (শব্দ + অর্থ + এলাকা) শুধু সেটাই সবার কাছে দৃশ্যমান হয়

---

## 🧰 টেক স্ট্যাক

`Next.js 16` · `React 19` · `Tailwind CSS 4` · `Neon Postgres` · `html-to-image` · `next-auth` (ঐচ্ছিক সোশ্যাল লগইন)

---

<div align="center">

**বাংলাদেশের প্রতিটা জেলার গল্প, একেকটা পোস্টারে 🇧🇩**

নিজেরটা বানাও → বন্ধুদের ট্যাগ করো → দেখো কে কটা ভাষা বোঝে!

</div>

</details>
