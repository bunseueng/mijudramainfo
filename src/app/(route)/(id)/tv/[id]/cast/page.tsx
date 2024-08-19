import React from "react";
import AllTvCast from "./AllTvCast";
import prisma from "@/lib/db";

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
