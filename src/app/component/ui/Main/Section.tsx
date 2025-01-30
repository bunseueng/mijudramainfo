import { cache } from "react";
import prisma from "@/lib/db";
import SectionContent from "./SectionContent";
import { DramaDB } from "@/helper/type";

export type HomeDramaT = {
  heading: string;
  getDrama: DramaDB[];
  existingRatings: any;
  categoryData: any;
  isDataLoading: boolean;
  path: string;
};

const getInitialData = cache(async () => {
  const [personDB, getDrama, existingRatings] = await Promise.all([
    prisma.person.findMany(),
    prisma.drama.findMany(),
    prisma.rating.findMany(),
  ]);

  return {
    personDB,
    getDrama,
    existingRatings,
    sections: {
      trending: "Trending",
      latestDrama: "Latest Drama",
      youkuSelection: "YOUKU Selection",
      wetvDrama: "WeTV Selection",
      iqiyiSelection: "iQIYI Selection",
      mongoTVDrama: "MongoTV Selection",
      actress: "Actor & Actress",
      koreanDrama: "Korean Drama",
      japaneseDrama: "Japanese Drama",
      chineseAnime: "Chinese Anime",
      japaneseAnime: "Japanese Anime",
    },
  };
});

export default async function Section() {
  const data = await getInitialData();

  return <SectionContent {...data} />;
}
