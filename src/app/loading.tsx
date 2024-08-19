"use client";

import NextTopLoader from "nextjs-toploader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <NextTopLoader
      color="orange"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #2299DD,0 0 5px #2299DD"
    />
  );
}
