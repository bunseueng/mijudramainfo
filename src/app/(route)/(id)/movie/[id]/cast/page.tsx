import React from "react";
import dynamic from "next/dynamic";
const AllMovieCast = dynamic(() => import("./AllMovieCast"), { ssr: false });

const AllMovieCastPage = ({ params }: any) => {
  const movie_id = params.id;
  return (
    <div>
      <AllMovieCast movie_id={movie_id} />
    </div>
  );
};

export default AllMovieCastPage;
