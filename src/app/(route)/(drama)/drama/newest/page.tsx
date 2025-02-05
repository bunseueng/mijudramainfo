import React, { Suspense } from "react";
import { Metadata } from "next";
import NewestDrama from "./NewestDrama";
import prisma from "@/lib/db";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Newest Drama",
  description: "Find Newest drama.",
  alternates: {
    canonical: `${process.env.BASE_URL}/drama/newest`,
  },
};

const NewestDramaPage = async () => {
  const getDrama = await prisma.drama.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Head>
        <link rel="canonical" href={`${process.env.BASE_URL}/drama/newest`} />
      </Head>
      <Suspense fallback={<SearchLoading />}>
        <NewestDrama getDrama={getDrama} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default NewestDramaPage;
