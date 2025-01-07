import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import Adsense from "./component/ui/Adsense/Adsense";
import SessionAllPage from "./component/ui/Main/SessionAllPage";
import dynamic from "next/dynamic";
import { PHProvider } from "@/provider/PostHogProvider";
import Provider from "@/provider/Provider";
import TanstackProvider from "@/provider/TanstackProvider";
import { ScrollProvider } from "@/provider/UseScroll";
const Loading = dynamic(() => import("./loading"));
const Footer = dynamic(() => import("./component/ui/Main/Footer"));

const nunito = Nunito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mijudramainfo.vercel.app"),
  title: {
    default: "MijuDramaInfo (MDI)",
    template: "%s - MijuDramaInfo (MDI)",
  },
  description:
    "Explore the vibrant world of Asian dramas and movies at MijuDramaInfo (MDI). Discover in-depth insights, trending titles, and the latest news about your favorite shows and actors.",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/apple-touch-icon.png" }],
  },
  applicationName: "MijuDramaInfo",
  keywords: ["mijudramainfo", "drama", "movie", "actor", "asian"],
  authors: [{ name: "Eng Bunseu", url: "https://mijudramainfo.vercel.app" }],
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
    url: "https://mijudramainfo.vercel.app",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.className}>
      <head>
        <link rel="preconnect" href="https://app.posthog.com" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <meta name="google-adsense-account" content="ca-pub-3369705912051027" />
        <Adsense pId="3369705912051027" />
      </head>
      <body
        className="bg-white dark:bg-[#14161a] h-screen"
        suppressHydrationWarning={true}
      >
        <PHProvider>
          <Provider>
            <TanstackProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ScrollProvider>
                  <Loading />
                  <div className="relative">
                    <SessionAllPage />
                    <main className="parent-container min-h-screen flex flex-col">
                      <div className="content-container flex-grow">
                        {children}
                      </div>
                    </main>
                    <Footer />
                  </div>
                </ScrollProvider>

                <ToastContainer position="top-right" />
              </ThemeProvider>
            </TanstackProvider>
          </Provider>
        </PHProvider>
        <Script strategy="afterInteractive" src="https://app.posthog.com" />
        <Script strategy="afterInteractive" src="https://api.themoviedb.org" />
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com"
        />
      </body>
    </html>
  );
}
