import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import VarietyShow from "./VarietyShow";
import prisma from "@/lib/db";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Variety Show",
  description: "Find Variety Show.",
};

const VarietyShowPage = async () => {
  const getDrama = await prisma.drama.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <VarietyShow getDrama={getDrama} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default VarietyShowPage;
