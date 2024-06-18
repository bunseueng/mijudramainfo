// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function PHProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const handlePageView = () => {
      const url = window.location.href;
      posthog.capture("$pageview", { $current_url: url });
    };

    // Capture initial page load
    handlePageView();

    // Listen for popstate events (triggered by browser navigation)
    window.addEventListener("popstate", handlePageView);

    return () => {
      window.removeEventListener("popstate", handlePageView);
    };
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
