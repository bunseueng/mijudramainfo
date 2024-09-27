import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function YouTubeTrailerSkeleton({
  heading,
}: {
  heading: string;
}) {
  return (
    <div className="mx-auto px-4">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden rounded-lg bg-muted animate-pulse"></div>
          <div className="flex space-x-4 p-4">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="w-[250px] flex-shrink-0">
                <CardContent className="p-0">
                  <div className="relative h-[140px] overflow-hidden rounded-t-lg">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="relative top-0 overflow-hidden px-2 py-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
