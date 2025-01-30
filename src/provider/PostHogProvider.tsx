"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PHProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const initializePostHog = () => {
      if (typeof window !== "undefined") {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
          person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
          autocapture: false, // Disable autocapture to reduce unnecessary events
          capture_performance: false, // Disable performance tracking if not needed
          disable_session_recording: true, // Disable session replays to reduce requests
          loaded: (posthog) => {
            // Sample 50% of events to reduce the number of requests
            if (Math.random() < 0.5) {
              posthog.opt_out_capturing(); // Opt out of capturing for this session
            }
          },
        });

        const handlePageView = () => {
          const url = window.location.href;
          posthog.capture("$pageview", { $current_url: url });
        };

        // Capture initial page load
        handlePageView();

        // Listen for popstate events (triggered by browser navigation)
        window.addEventListener("popstate", handlePageView);

        // Cleanup event listener on unmount
        return () => {
          window.removeEventListener("popstate", handlePageView);
        };
      }
    };

    // Delay initialization by 5 seconds to improve initial load performance
    const timeoutId = setTimeout(initializePostHog, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
