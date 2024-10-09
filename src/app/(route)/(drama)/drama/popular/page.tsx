import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
const PopularDrama = dynamic(() => import("./PopularDrama"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Popular Drama",
  description: "Find Popular drama.",
};
const PopularDramaPage = async () => {
  const getDrama = await prisma.drama.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularDrama getDrama={getDrama} />
      </Suspense>
    </div>
  );
};

export default PopularDramaPage;
