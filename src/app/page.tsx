import { Suspense } from "react";
import Section from "./component/ui/Main/Section";
import SearchLoading from "./component/ui/Loading/SearchLoading";
import HeaderSlider from "./component/ui/Slider/HeaderSlider";
import AdArticle from "./component/ui/Adsense/AdArticle";

export const revalidate = 60;
export default async function Home() {
  return (
    <div className="flex flex-col bg-customLight dark:bg-customDark overflow-hidden">
      <Suspense fallback={<SearchLoading />}>
        <div className="relative h-[56vw] max-h-[1012px] overflow-hidden mb-4 xl:-mb-[198px]">
          <HeaderSlider />
        </div>
      </Suspense>
      <Section />
      <div className="max-w-[1808px] mx-auto w-[80%] md:w-full min-h-[200px] my-10">
        <div className="relative w-full min-h-[200px]">
          <div className="absolute inset-0">
            <AdArticle dataAdFormat="auto" dataAdSlot="4321696148" />
          </div>
        </div>
      </div>
    </div>
  );
}
