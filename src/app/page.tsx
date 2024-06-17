import Actor from "./component/ui/Fetching/Actor";
import Trailer from "./component/ui/Fetching/Trailer";
import LatestDrama from "./component/ui/Fetching/LatestDrama";
import TrendingDrama from "./component/ui/Fetching/TrendingDrama";
import Header from "./component/ui/Main/Header";
import { Suspense } from "react";
import SearchLoading from "./component/ui/Loading/SearchLoading";
import HomeLoading from "./component/ui/Loading/HomeLoading";

export default async function Home() {
  const trending = "Trending";
  const latestDrama = "Latest Drama";
  const actress = "Actor & Actress";
  const trailer = "Latest Trailer";

  return (
    <>
      <main className="leading-relaxed tracking-wide flex flex-col md:max-w-[1520px] mx-auto">
        <Header />
      </main>
      <section className="max-w-[90%] lg:max-w-[80%] mx-auto">
        <div className="mb-10">
          <Suspense fallback="Loading...">
            <TrendingDrama heading={trending} />
          </Suspense>
        </div>
        <div className="mb-10">
          <Suspense fallback="Loading...">
            <Actor heading={actress} />
          </Suspense>
        </div>
        <div className="mb-10">
          <Suspense fallback="Loading...">
            <LatestDrama heading={latestDrama} />
          </Suspense>
        </div>
        <div className="mb-5">
          <Suspense fallback="Loading...">
            <Trailer heading={trailer} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
