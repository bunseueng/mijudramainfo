import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeletonLoading = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-16 left-0 w-full max-w-7xl px-4 md:px-16 mx-auto">
        <div className="max-w-3xl">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-2" />
          <Skeleton className="h-6 w-4/6 mb-6" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeletonLoading;
