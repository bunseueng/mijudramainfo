import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/provider/TanstackProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Provider from "@/provider/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionAllPage from "./component/ui/Main/SessionAllPage";
import Footer from "./component/ui/Main/Footer";
import { PHProvider } from "@/provider/PostHogProvider";
import { Suspense } from "react";

const nunito = Nunito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MijuDramaList",
    template: "%s - MijuDramaList",
  },
  description: "Best website to find your favorite movie/drama/actor",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-slate-100 dark:bg-[#1e1e1e]  ${nunito.className}`}>
        <PHProvider>
          <Provider>
            <TanstackProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className="flex flex-col top-0 sticky z-50">
                  <SessionAllPage />
                </div>
                {children}
                <div className="w-full ">
                  <Footer />
                </div>
                <ToastContainer position="top-right" />
              </ThemeProvider>
            </TanstackProvider>
          </Provider>
        </PHProvider>
      </body>
    </html>
  );
}
