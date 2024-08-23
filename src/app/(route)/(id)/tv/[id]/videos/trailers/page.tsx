import React from "react";
import TvVideo from "../TvVideo";
import prisma from "@/lib/db";

const TrailerPage = async ({ params }: { params: { id: string } }) => {
  const tv_id = params.id;
  const tvDB = await prisma.drama.findUnique({ where: { tv_id: tv_id } });
  return <TvVideo tv_id={tv_id} tvDB={tvDB} />;
};

export default TrailerPage;
