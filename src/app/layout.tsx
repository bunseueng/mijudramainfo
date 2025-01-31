export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import Adsense from "./component/ui/Adsense/Adsense";
import SessionAllPage from "./component/ui/Main/SessionAllPage";
import { PHProvider } from "@/provider/PostHogProvider";
import Provider from "@/provider/Provider";
import TanstackProvider from "@/provider/TanstackProvider";
import { ScrollProvider } from "@/provider/UseScroll";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import Loading from "./loading";
import Footer from "./component/ui/Main/Footer";

const nunito = Nunito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mijudramainfo.vercel.app"),
  title: {
    default: "MijuDramaInfo (MDI)",
    template: "%s - MijuDramaInfo (MDI)",
  },
  alternates: {
    canonical: "./",
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
  keywords: [
    "mijudramainfo",
    "drama",
    "movie",
    "actor",
    "asian",
    "chinese Drama",
    "c-drama",
    "actress",
    "information",
  ],
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
      <Head>
        <link rel="icon" href="data:," />
        <link rel="preconnect" href="https://app.posthog.com" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <meta name="google-adsense-account" content="ca-pub-3369705912051027" />
        <Adsense pId="3369705912051027" />
        {/* Scripts loaded after interactive */}
        {[
          "https://app.posthog.com",
          "https://api.themoviedb.org",
          "https://pagead2.googlesyndication.com",
        ].map((url) => (
          <Script key={url} strategy="worker" src={url} />
        ))}
        <script
          data-partytown-config
          dangerouslySetInnerHTML={{
            __html: `
              partytown = {
                lib: "/_next/static/~partytown/",
                debug: true
              };
            `,
          }}
        />
        <Analytics />
      </Head>
      <body className="bg-white dark:bg-[#111319]" suppressHydrationWarning>
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
                  <main className="min-h-screen flex flex-col">
                    <SessionAllPage />
                    {children}
                    <Footer />
                  </main>
                  <ToastContainer
                    position="top-right"
                    toastStyle={{ zIndex: 9999 }}
                  />
                </ScrollProvider>
              </ThemeProvider>
            </TanstackProvider>
          </Provider>
        </PHProvider>
      </body>
    </html>
  );
}
