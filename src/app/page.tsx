import { Suspense } from "react";
import prisma from "@/lib/db";
import Section from "./component/ui/Main/Section";
import SearchLoading from "./component/ui/Loading/SearchLoading";
import { connection } from "next/server";
import HeaderSlider from "./component/ui/Slider/HeaderSlider";

export const revalidate = 60;
export default async function Home() {
  await connection();
  const existingRatings = await prisma.rating.findMany();

  return (
    <div className="flex flex-col bg-customLight dark:bg-customDark overflow-hidden">
      <Suspense fallback={<SearchLoading />}>
        <div className="relative h-[56vw] max-h-[1012px] overflow-hidden mb-4 xl:-mb-[198px]">
          <HeaderSlider existingRatings={existingRatings} />
        </div>
      </Suspense>
      <Suspense fallback={<SearchLoading />}>
        <Section />
      </Suspense>
    </div>
  );
}
