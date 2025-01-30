import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomepageDrama } from "@/app/actions/fetchMovieApi";
import HomeCard from "../Card/HomeCard";
import Actor from "../Card/Actor";
import SearchLoading from "../Loading/SearchLoading";

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
  getDrama: any[];
  existingRatings: any[];
  personDB: any;
}

const HomeDrama: React.FC<DramaCategoriesProps> = ({
  getDrama,
  existingRatings,
  personDB,
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
    <div className="space-y-10">
      {CATEGORIES.map(({ key, title, path }) => (
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
              existingRatings={existingRatings}
              categoryData={{ results: data?.responseData?.[key] || [] }}
              isDataLoading={isLoading}
              path={path}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default HomeDrama;
