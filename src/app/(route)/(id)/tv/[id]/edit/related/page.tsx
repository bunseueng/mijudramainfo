import React from "react";
import prisma from "@/lib/db";
import TvEdit from "../detail/TvEdit";
import TvEditList from "../detail/TvEditList";

const RelatedTittlePage = async ({ params }: { params: { id: string } }) => {
  const tv_id = params.id;
  const tvDetails = await prisma.drama.findUnique({
    where: {
      tv_id: tv_id,
    },
  });
  return (
    <div className="flex flex-col w-full min-h-screen mb-10">
      <TvEdit tv_id={tv_id} />
      <TvEditList tv_id={tv_id} tvDetails={tvDetails} />
    </div>
  );
};

export default RelatedTittlePage;
