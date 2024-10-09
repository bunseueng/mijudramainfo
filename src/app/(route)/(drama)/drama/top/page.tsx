import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import TopDrama from "./TopDrama";
import prisma from "@/lib/db";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Top Rated Drama",
  description: "Find Top Rated drama.",
};

const TopDramaPage = async () => {
  const getDrama = await prisma.drama.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopDrama getDrama={getDrama} />
      </Suspense>
    </div>
  );
};

export default TopDramaPage;
