import TrendingDrama from "../Fetching/TrendingDrama";
import Actor from "../Fetching/Actor";
import LatestDrama from "../Fetching/LatestDrama";
import Trailer from "../Fetching/Trailer";
import TopActor from "./TopActor";
import prisma from "@/lib/db";

export async function generateStaticParams() {
  const person = await prisma.person.findMany({});

  return person?.map((p) => ({
    params: { id: p?.id?.toString() },
  }));
}

export default async function Section() {
  const trending = "Trending";
  const latestDrama = "Latest Drama";
  const actress = "Actor & Actress";
  const trailer = "Latest Trailer";
  const actor = "Actor Leaderboard";

  const personDB = await prisma.person.findMany({});
  const getDrama = await prisma.drama.findMany({});
  return (
    <section
      className="relative z-50 bg-customLight dark:bg-customDark from-transparent to-customLight dark:to-customDark -mt-[157px] pt-[150px]"
      style={{ transform: "translateZ(10px)" }}
    >
      <div className="relative overflow-hidden max-w-6xl mx-auto">
        <div className="mb-10 min-h-[300px]">
          <TrendingDrama heading={trending} getDrama={getDrama} />
        </div>

        <div className="mb-10 min-h-[300px]">
          <Actor heading={actress} personDB={personDB} />
        </div>
        <div className="mb-10 min-h-[300px]">
          <LatestDrama heading={latestDrama} getDrama={getDrama} />
        </div>
        <div className="mb-10 min-h-[300px]">
          <Trailer heading={trailer} />
        </div>
        <div className="mb-10 min-h-[300px]">
          <TopActor heading={actor} personDB={personDB} />
        </div>
      </div>
    </section>
  );
}
