import React from "react";
import prisma from "@/lib/db";
import TvVideo from "./TvVideo";

const TvVideosPage = async ({ params }: any) => {
  const tv_id = params.id;
  const tvDB = await prisma.drama.findUnique({ where: { tv_id: tv_id } });
  const getDrama = await prisma.drama.findMany();
  return <TvVideo tv_id={tv_id} tvDB={tvDB} getDrama={getDrama} />;
};

export default TvVideosPage;
