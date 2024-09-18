import prisma from "@/lib/db";
import React from "react";
import dynamic from "next/dynamic";
const TvVideo = dynamic(() => import("../TvVideo"), { ssr: false });

const OpeningCreditPage = async ({ params }: any) => {
  const tv_id = params.id;
  const tvDB = await prisma.drama.findUnique({ where: { tv_id: tv_id } });
  return <TvVideo tv_id={tv_id} tvDB={tvDB} />;
};

export default OpeningCreditPage;
