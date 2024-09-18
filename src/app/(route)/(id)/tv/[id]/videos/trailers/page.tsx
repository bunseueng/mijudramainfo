import React from "react";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";
const TvVideo = dynamic(() => import("../TvVideo"), { ssr: false });

const TrailerPage = async ({ params }: { params: { id: string } }) => {
  const tv_id = params.id;
  const tvDB = await prisma.drama.findUnique({ where: { tv_id: tv_id } });
  return <TvVideo tv_id={tv_id} tvDB={tvDB} />;
};

export default TrailerPage;
