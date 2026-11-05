import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/auth/Providers";
import { PwaRegister } from "@/components/pwa/PwaRegister";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vibemap.vercel.app"),
  title: "VibeMap — Built in Bangladesh",
  description:
    "Discover apps, websites and digital products built by Bangladeshi developers across all 64 districts.",
  keywords: ["ভাইবম্যাপ", "VibeMap", "বাংলাদেশ ম্যাপ", "Bangladeshi developers", "tools directory", "vibecoding"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ভাইবম্যাপ",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "VibeMap — Built in Bangladesh",
    description: "Explore Bangladesh’s vibecoded tools directory.",
    type: "website",
    locale: "bn_BD",
  },
};

export const viewport = {
  themeColor: "#101513",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function themeInitScript() {
  return `(function(){try{var t=localStorage.getItem("vibemap:theme");if(t!=="dark"){t="light"}document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${hind.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <PwaRegister />
        <Providers>
          <Header />
          <main className="vm-main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
