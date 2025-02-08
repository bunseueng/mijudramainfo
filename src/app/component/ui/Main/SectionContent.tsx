"use client";

import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import HomeCardSkeleton from "../Loading/HomeLoading";
import { useDatabase } from "@/hooks/useDatabase";
import { DramaDB, IRating } from "@/helper/type";

const HomeDrama = lazy(() => import("./HomeDrama"));

const CATEGORIES = [
  { key: "trending", title: "Trending Drama", path: "tv" },
  { key: "latest", title: "Latest Drama", path: "tv" },
  { key: "actors", title: "Top Actor", path: "person" },
  { key: "iqiyi", title: "iQIYI Selection", path: "tv" },
  { key: "youku", title: "YOUKU Selection", path: "tv" },
  { key: "tencent", title: "WeTV Selection", path: "tv" },
  { key: "mongotv", title: "MongoTV Selection", path: "tv" },
  { key: "korean", title: "Korean Drama", path: "tv" },
  { key: "japanese", title: "Japanese Drama", path: "tv" },
  { key: "chineseAnime", title: "Chinese Anime", path: "tv" },
];

function SectionContent() {
  const { data } = useDatabase();
  const { getDrama, personDB, rating } = { ...data };
  const [visibleCategories, setVisibleCategories] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 100) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  const loadMoreCategories = useCallback(() => {
    if (
      inView &&
      hasScrolled &&
      visibleCategories < CATEGORIES.length &&
      !loading
    ) {
      setLoading(true);
      setTimeout(() => {
        setVisibleCategories((prev) => Math.min(prev + 3, CATEGORIES.length));
        setLoading(false);
      }, 300);
    }
  }, [inView, visibleCategories, loading, hasScrolled]);

  useEffect(() => {
    loadMoreCategories();
  }, [loadMoreCategories]);

  const hasMoreCategories = visibleCategories < CATEGORIES.length;

  return (
    <section
      className="min-h-screen z-[999]"
      style={{ transform: "translateZ(10px)" }}
    >
      <div className="min-h-[60vh]">
        <Suspense fallback={<HomeCardSkeleton />}>
          <HomeDrama
            getDrama={getDrama as DramaDB[] | []}
            existingRatings={rating as unknown as IRating[] | []}
            personDB={personDB}
            visibleCategories={hasScrolled ? visibleCategories : 1}
            hasMoreCategories={hasMoreCategories}
            ref={ref}
          />
        </Suspense>
      </div>
    </section>
  );
}

export default SectionContent;
