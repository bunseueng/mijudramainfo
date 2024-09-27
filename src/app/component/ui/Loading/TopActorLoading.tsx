import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopActorSkeleton() {
  return (
    <Card className="w-full !bg-transparent !border-0 !rounded-none px-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          <Skeleton className="h-8 w-64 mx-auto" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 2nd Place */}
          <Card className="w-full md:w-1/3 bg-gradient-to-b from-gray-100 to-gray-200">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block">
                <Skeleton className="w-8 h-8 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2" />
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-2" />
              </div>
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-2" />
              <div className="inline-flex items-center justify-center">
                <Skeleton className="w-10 h-10 rounded-full mr-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>

          {/* 1st Place */}
          <Card className="w-full md:w-1/3 bg-gradient-to-b from-yellow-100 to-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block">
                <Skeleton className="w-10 h-10 rounded-full absolute -top-5 left-1/2 transform -translate-x-1/2" />
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-2" />
              </div>
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-2" />
              <div className="inline-flex items-center justify-center">
                <Skeleton className="w-10 h-10 rounded-full mr-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>

          {/* 3rd Place */}
          <Card className="w-full md:w-1/3 bg-gradient-to-b from-orange-100 to-orange-200">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block">
                <Skeleton className="w-8 h-8 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2" />
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-2" />
              </div>
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-2" />
              <div className="inline-flex items-center justify-center">
                <Skeleton className="w-10 h-10 rounded-full mr-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 bg-primary/10 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
