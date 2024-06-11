import React from "react";
import AllTvCast from "./AllTvCast";

const AllTvCastPage = ({ params }: any) => {
  const tv_id = params.id;
  return (
    <div>
      <AllTvCast tv_id={tv_id} />
    </div>
  );
};

export default AllTvCastPage;
