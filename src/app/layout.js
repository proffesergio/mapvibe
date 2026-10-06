import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/auth/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "ম্যাপভাইব — বাংলাদেশ ম্যাপ পোস্টার মেকার",
  description:
    "আঞ্চলিক ভাষা, শৈশব স্মৃতি, খেলাধুলা ও ভ্রমণ র‍্যাংক — ফেসবুক পোস্টার বানান ১ মিনিটে।",
  keywords: ["ম্যাপভাইব", "MapVibe", "বাংলাদেশ ম্যাপ", "ফেসবুক পোস্টার", "আঞ্চলিক ভাষা", "নস্টালজিয়া"],
  openGraph: {
    title: "ম্যাপভাইব — ১ মিনিটে ভাইরাল FB পোস্টার",
    description: "থিম বেছে নিন → ম্যাপে পিক করুন → ছবি দিন → ১০৮০×১০৮০ ডাউনলোড",
    type: "website",
    locale: "bn_BD",
  },
};

function themeInitScript() {
  return `(function(){try{var t=localStorage.getItem("mapvibe:theme");if(t!=="dark"){t="light"}document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`;
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${inter.variable} ${hind.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
