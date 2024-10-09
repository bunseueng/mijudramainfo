import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import NewestDrama from "./NewestDrama";
import prisma from "@/lib/db";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Newest Drama",
  description: "Find Newest drama.",
};

const NewestDramaPage = async () => {
  const getDrama = await prisma.drama.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <NewestDrama getDrama={getDrama} />
      </Suspense>
    </div>
  );
};

export default NewestDramaPage;
