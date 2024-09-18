import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Lazy load components
const TrendingDrama = dynamic(() => import("../Fetching/TrendingDrama"), {
  ssr: false,
});
const Actor = dynamic(() => import("../Fetching/Actor"), { ssr: false });
const LatestDrama = dynamic(() => import("../Fetching/LatestDrama"), {
  ssr: false,
});
const Trailer = dynamic(() => import("../Fetching/Trailer"), { ssr: false });

export default function Section() {
  const trending = "Trending";
  const latestDrama = "Latest Drama";
  const actress = "Actor & Actress";
  const trailer = "Latest Trailer";

  return (
    <section className="relative min-h-[600px] bg-customLight dark:bg-customDark from-transparent to-customLight dark:to-customDark -mt-[157px] pt-[150px] overflow-hidden z-50">
      <div className="relative overflow-hidden max-w-6xl mx-auto">
        <div className="mb-10">
          <Suspense fallback={<div>Loading...</div>}>
            <TrendingDrama heading={trending} />
          </Suspense>
        </div>

        <div className="mb-10">
          <Suspense fallback={<div>Loading...</div>}>
            <Actor heading={actress} />
          </Suspense>
        </div>
        <div className="mb-10">
          <Suspense fallback={<div>Loading...</div>}>
            <LatestDrama heading={latestDrama} />
          </Suspense>
        </div>
        <div className="mb-10">
          <Suspense fallback={<div>Loading...</div>}>
            <Trailer heading={trailer} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
