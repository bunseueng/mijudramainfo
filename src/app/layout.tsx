import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/provider/TanstackProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Provider from "@/provider/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PHProvider } from "@/provider/PostHogProvider";
import dynamic from "next/dynamic";
import { ScrollProvider } from "@/provider/UseScroll";
import Script from "next/script";
const Adsense = dynamic(() => import("./component/ui/Adsense/Adsense"), {
  ssr: false,
});
const Footer = dynamic(() => import("./component/ui/Main/Footer"), {
  ssr: false,
});
const SessionAllPage = dynamic(
  () => import("./component/ui/Main/SessionAllPage"),
  {
    ssr: false,
  }
);
const Loading = dynamic(() => import("./loading"), { ssr: false });

const nunito = Nunito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mijudramainfo.vercel.app/"),
  title: {
    default: "MijuDramaInfo (MDI)",
    template: "%s - MijuDramaInfo (MDI)",
  },
  description:
    "Discover, Discuss, and Organize the Best Asian Dramas, Movies, and Actors",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
  openGraph: {
    title:
      "Discover, Discuss, and Organize the Best Asian Dramas, Movies, and Actors | MijuDramaInfo",
    description:
      "Discover, Discuss, and Organize the Best Asian Dramas, Movies, and Actors",
    type: "website",
    locale: "en_US",
    url: "https://mijudramainfo.vercel.app/",
    siteName: "MijuDramaInfo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Adsense pId="3369705912051027" />
        <meta
          name="google-adsense-account"
          content="ca-pub-3369705912051027"
        ></meta>
      </head>
      <body className={`bg-[#fff] dark:bg-[#14161a] ${nunito.className}`}>
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
                  <div className="flex flex-col top-0 sticky z-[9999]">
                    <SessionAllPage />
                  </div>
                  <div className="parent-container min-h-screen flex flex-col">
                    <div className="content-container flex-grow">
                      {children}
                    </div>
                    <Footer />
                  </div>
                </ScrollProvider>

                <ToastContainer position="top-right" />
              </ThemeProvider>
            </TanstackProvider>
          </Provider>
        </PHProvider>
      </body>
    </html>
  );
}
