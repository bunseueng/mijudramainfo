import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import UpcomingDrama from "./UpcomingDrama";
import prisma from "@/lib/db";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Upcoming Drama",
  description: "Find Upcoming drama.",
};

const UpcomingDramaPage = async () => {
  const getDrama = await prisma.drama.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <UpcomingDrama getDrama={getDrama} />
      </Suspense>
    </div>
  );
};

export default UpcomingDramaPage;
