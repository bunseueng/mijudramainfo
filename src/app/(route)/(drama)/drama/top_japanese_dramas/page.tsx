import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Top100Japanese from "./Top100Japanese";
import prisma from "@/lib/db";

const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Top 100 Japanese Dramas",
  description: "Explore our Top 100 Japanese Dramas",
  alternates: {
    canonical: `${process.env.BASE_URL}/drama/top_japanese_dramas`,
  },
};

const TopJapaneseDrama = async () => {
  const getDrama = await prisma.drama.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <Top100Japanese getDrama={getDrama} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default TopJapaneseDrama;
