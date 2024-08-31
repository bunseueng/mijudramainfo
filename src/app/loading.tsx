"use client";

import NextTopLoader from "nextjs-toploader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <NextTopLoader
      color="#22d3ee"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      zIndex={99991}
    />
  );
}
