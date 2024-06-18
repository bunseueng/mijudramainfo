import Actor from "./component/ui/Fetching/Actor";
import Trailer from "./component/ui/Fetching/Trailer";
import LatestDrama from "./component/ui/Fetching/LatestDrama";
import TrendingDrama from "./component/ui/Fetching/TrendingDrama";
import Header from "./component/ui/Main/Header";
import { Suspense } from "react";

export default async function Home() {
  const trending = "Trending";
  const latestDrama = "Latest Drama";
  const actress = "Actor & Actress";
  const trailer = "Latest Trailer";

  return (
    <>
      <main className="leading-relaxed tracking-wide flex flex-col md:max-w-[1520px] mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
      </main>
      <section className="max-w-[90%] lg:max-w-[80%] mx-auto">
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
        <div className="mb-5">
          <Suspense fallback={<div>Loading...</div>}>
            <Trailer heading={trailer} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
