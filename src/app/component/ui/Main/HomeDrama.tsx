import type React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomepageDrama } from "@/app/actions/fetchMovieApi";
import HomeCard from "../Card/HomeCard";
import Actor from "../Card/Actor";
import SearchLoading from "../Loading/SearchLoading";
import { DramaDB } from "@/helper/type";

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

interface DramaCategoriesProps {
  getDrama: DramaDB[];
  personDB: any;
  visibleCategories: number;
  ref: (node?: Element | null | undefined) => void;
  hasMoreCategories: boolean;
}

const HomeDrama: React.FC<DramaCategoriesProps> = ({
  getDrama,
  personDB,
  visibleCategories,
  hasMoreCategories,
  ref,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["homepageDrama"],
    queryFn: fetchHomepageDrama,
    staleTime: 3600000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <SearchLoading />;
  }

  return (
    <div className="min-h-[60vh] overflow-visible whitespace-nowrap relative space-y-10">
      {CATEGORIES.slice(0, visibleCategories).map(({ key, title, path }) => (
        <div key={key}>
          {key === "actors" ? (
            <Actor
              key={key}
              heading={title}
              personDB={personDB}
              categoryData={{ results: data?.responseData?.[key] || [] }}
              isLoading={isLoading}
            />
          ) : (
            <HomeCard
              key={key}
              heading={title}
              getDrama={getDrama}
              categoryData={{ results: data?.responseData?.[key] || [] }}
              isDataLoading={isLoading}
              path={path}
            />
          )}
        </div>
      ))}
      <div ref={ref} className="flex justify-center items-center p-0 w-full">
        {hasMoreCategories && (
          <div
            className="w-[100px] h-[100px] flex items-center justify-center text-primary bg-[url('/ghost-loading.gif')] bg-no-repeat bg-center"
            style={{
              transform: "scale(0.60)",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default HomeDrama;
