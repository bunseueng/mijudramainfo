"use client";

import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import HomeCardSkeleton from "../Loading/HomeLoading";
import { LoaderCircle } from "lucide-react";

// Lazy load components
const Actor = lazy(() => import("../Card/Actor"));
const TrendingDrama = lazy(() => import("./TrendingDrama"));
const LatestDrama = lazy(() => import("./LatestDrama"));
const IqiyiDrama = lazy(() => import("./IqiyiDrama"));
const YoukuDrama = lazy(() => import("./YoukuDrama"));
const WeTVDrama = lazy(() => import("./WeTVDrama"));
const MongoTVDrama = lazy(() => import("./MongoTVDrama"));
const KoreanDrama = lazy(() => import("./KoreanDrama"));
const JapaneseDrama = lazy(() => import("./JapaneseDrama"));
const ChineseAnime = lazy(() => import("./ChineseAnime"));
const JapaneseAnime = lazy(() => import("./JapaneseAnime"));

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
      Component: TrendingDrama,
      props: { heading: sections.trending, getDrama, existingRatings },
    },
    {
      Component: LatestDrama,
      props: { heading: sections.latestDrama, getDrama, existingRatings },
    },
    {
      Component: Actor,
      props: { heading: sections.actress, personDB },
    },
    {
      Component: YoukuDrama,
      props: { heading: sections.youkuSelection, getDrama, existingRatings },
    },
    {
      Component: WeTVDrama,
      props: { heading: sections.wetvDrama, getDrama, existingRatings },
    },
    {
      Component: IqiyiDrama,
      props: { heading: sections.iqiyiSelection, getDrama, existingRatings },
    },
    {
      Component: MongoTVDrama,
      props: { heading: sections.mongoTVDrama, getDrama, existingRatings },
    },
    {
      Component: KoreanDrama,
      props: { heading: sections.koreanDrama, getDrama, existingRatings },
    },
    {
      Component: JapaneseDrama,
      props: { heading: sections.japaneseDrama, getDrama, existingRatings },
    },
    {
      Component: ChineseAnime,
      props: { heading: sections.chineseAnime, getDrama, existingRatings },
    },
    {
      Component: JapaneseAnime,
      props: { heading: sections.japaneseAnime, getDrama, existingRatings },
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
