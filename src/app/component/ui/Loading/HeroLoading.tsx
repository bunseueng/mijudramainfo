import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeletonLoading() {
  return (
    <div className="relative">
      <div className="relative w-full h-[50vh] lg:h-[670px] overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute top-0 w-full h-[15vh] lg:h-[174px]">
          <div className="h-[20%] lg:h-[64px] bg-gray-300"></div>
          <div className="h-[80%] lg:h-[110px] bg-gradient-to-b from-gray-300 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 w-full h-[20vh] lg:h-[230px] bg-gradient-to-t from-gray-200 to-transparent"></div>
        <div className="w-full lg:w-[305px] absolute top-[64px] bottom-0 right-10 md:right-24 overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="w-full lg:min-w-[305px] h-[488px] pt-6 space-y-2">
              {[...Array(10)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8 w-full bg-gray-300 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
