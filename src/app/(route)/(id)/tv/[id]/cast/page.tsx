import React from "react";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";
const AllTvCast = dynamic(() => import("./AllTvCast"), { ssr: false });

const AllTvCastPage = async ({ params }: any) => {
  const tv_id = params.id;
  const getDrama = await prisma.drama.findUnique({ where: { tv_id: tv_id } });
  return (
    <div>
      <AllTvCast tv_id={tv_id} getDrama={getDrama} />
    </div>
  );
};

export default AllTvCastPage;
