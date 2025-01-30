"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";

interface AutoRedirectProps {
  redirectUrl: string;
  countdownSeconds?: number;
  message?: string;
}

export default function AutoRedirect({
  redirectUrl,
  countdownSeconds = 5,
  message = "Redirecting in",
}: AutoRedirectProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!redirectUrl) {
      console.error("No redirect URL provided");
      return;
    }

    let url;
    try {
      url = new URL(redirectUrl);
    } catch (error) {
      console.error("Invalid redirect URL:", error);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(url.toString());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [redirectUrl, router]);

  const redirectNow = () => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  if (!redirectUrl) {
    return (
      <div className="text-center text-red-500">
        Error: No redirect URL provided
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-lg shadow-xl p-8 max-w-md w-full space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-foreground">Auto Redirect</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <Progress
          value={((countdownSeconds - countdown) / countdownSeconds) * 100}
          className="w-full"
        />
        <div className="text-center space-y-2">
          <p className="text-xl text-foreground">
            {message}{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={countdown}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.3 }}
                className="text-primary font-bold inline-block"
              >
                {countdown}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
        <Button onClick={redirectNow} className="w-full text-lg font-semibold">
          Redirect Now
          <motion.span
            className="inline-block ml-2"
            animate={{ x: [0, 5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.span>
        </Button>
      </motion.div>
    </div>
  );
}
