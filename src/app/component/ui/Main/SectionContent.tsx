"use client";

import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import HomeCardSkeleton from "../Loading/HomeLoading";
import { LoaderCircle } from "lucide-react";

// Lazy load components
const HomeDrama = lazy(() => import("./HomeDrama"));
function SectionContent({
  personDB,
  getDrama,
  existingRatings,
  sections,
}: any) {
  const [visibleSections, setVisibleSections] = useState(3);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const sectionComponents = [
    {
      Component: HomeDrama,
      props: {
        heading: sections.trending,
        getDrama,
        existingRatings,
        personDB,
      },
    },
  ];

  const loadMoreSections = useCallback(() => {
    if (inView && visibleSections < sectionComponents.length && !loading) {
      setLoading(true);
      // Use requestAnimationFrame for smoother loading
      requestAnimationFrame(() => {
        setVisibleSections((prev) =>
          Math.min(prev + 2, sectionComponents.length)
        );
        setLoading(false);
      });
    }
  }, [inView, visibleSections, loading, sectionComponents.length]);

  useEffect(() => {
    loadMoreSections();
  }, [loadMoreSections, inView]);

  const hasMoreSections = visibleSections < sectionComponents.length;

  return (
    <section
      className="relative z-[999]"
      style={{ transform: "translateZ(10px)" }}
    >
      {sectionComponents
        .slice(0, visibleSections)
        .map(({ Component, props }, index) => (
          <Suspense key={index} fallback={<HomeCardSkeleton />}>
            <div className="mb-10">
              <Component {...(props as any)} />
            </div>
          </Suspense>
        ))}

      {hasMoreSections && (
        <div ref={ref} className="flex justify-center py-8" aria-hidden="true">
          {loading && <LoaderCircle className="animate-spin h-8 w-8" />}
        </div>
      )}
    </section>
  );
}

export default SectionContent;
