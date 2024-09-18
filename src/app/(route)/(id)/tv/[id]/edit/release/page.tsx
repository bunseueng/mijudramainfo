import React from "react";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";

const TvEdit = dynamic(() => import("../detail/TvEdit"), { ssr: false });
const TvEditList = dynamic(() => import("../detail/TvEditList"), {
  ssr: false,
});

const ReleasePage = async ({ params }: { params: { id: string } }) => {
  const tv_id = params.id;
  const tvDetails = await prisma.drama.findUnique({
    where: {
      tv_id: tv_id,
    },
  });
  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
      <TvEdit tv_id={tv_id} />
      <TvEditList tv_id={tv_id} tvDetails={tvDetails} />
    </div>
  );
};

export default ReleasePage;
