import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import { PHProvider } from "@/provider/PostHogProvider";
import Provider from "@/provider/Provider";
import TanstackProvider from "@/provider/TanstackProvider";
import { ScrollProvider } from "@/provider/UseScroll";
import { Analytics } from "@vercel/analytics/react";
import Loading from "./loading";
import Footer from "./component/ui/Main/Footer";
import type React from "react";
import Navbar from "./component/ui/Navbar/Navbar";

// Optimize font loading
const nunito = Nunito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-nunito", // Enable CSS variable for better performance
  adjustFontFallback: true, // Optimize font fallback
});

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.BASE_URL}`),
  title: {
    default: "MijuDramaInfo (MDI)",
    template: "%s - MijuDramaInfo (MDI)",
  },
  description:
    "Explore the vibrant world of Asian dramas and movies at MijuDramaInfo (MDI). Discover in-depth insights, trending titles, and the latest news about your favorite shows and actors.",
  applicationName: "MijuDramaInfo",
  keywords: [
    "mijudramainfo",
    "drama",
    "movie",
    "steaming",
    "actor",
    "asian",
    "chinese Drama",
    "c-drama",
    "c drama",
    "actress",
    "information",
    "watch",
    "wetv",
    "youku",
    "iqiyi",
  ],
  authors: [{ name: "Eng Bunseu", url: `${process.env.BASE_URL}` }],
  creator: "Eng Bunseu",
  publisher: "Eng Bunseu",
  openGraph: {
    title:
      "Discover, Discuss, and Organize the Best Asian Dramas, Movies, and Actors | MijuDramaInfo",
    description:
      "Explore the vibrant world of Asian dramas and movies at MijuDramaInfo (MDI). Join a community of fans passionate about sharing reviews, recommendations, and discussions.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "MijuDramaInfo Banner",
      },
    ],
    type: "website",
    locale: "en_US",
    url: `${process.env.BASE_URL}`,
    siteName: "MijuDramaInfo",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Discover, Discuss, and Organize the Best Asian Dramas, Movies, and Actors | MijuDramaInfo",
    description:
      "Explore the vibrant world of Asian dramas and movies at MijuDramaInfo (MDI). Join a community of fans passionate about sharing reviews, recommendations, and discussions.",
    images: ["/opengraph-image.png"],
    site: "@MijuDramaInfo",
    creator: "@EngBunseu",
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/apple-touch-icon.png" }],
  },
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider>
      <Provider>
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ScrollProvider>{children}</ScrollProvider>
          </ThemeProvider>
        </TanstackProvider>
      </Provider>
    </PHProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MijuDramaInfo",
    url: "https://mijudramainfo.vercel.app/",
    alternateName: ["MijuDrama"],
  };
  return (
    <html lang="en" className={`${nunito.variable} font-sans`}>
      <head>
        <link rel="canonical" href={`${process.env.BASE_URL}`} />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-white dark:bg-[#111319]" suppressHydrationWarning>
        <Providers>
          <Loading />
          <main className="min-h-screen flex flex-col">
            <Navbar />
            {children}
            <Footer />
          </main>
          <ToastContainer position="top-right" toastStyle={{ zIndex: 9999 }} />
        </Providers>

        {/* Preconnect to critical domains */}
        <link
          rel="dns-prefetch"
          href="https://app.posthog.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://api.themoviedb.org"
          crossOrigin="anonymous"
        />
        {/* Analytics and Ads */}
        <Analytics />

        {/* Third-party scripts with web worker strategy */}
        <Script
          src="https://app.posthog.com/static/array.js"
          strategy="worker"
          defer
        />
      </body>
    </html>
  );
}
