import React from "react";
import AllMovieCast from "./AllMovieCast";

const AllMovieCastPage = ({ params }: any) => {
  const movie_id = params.id;
  return (
    <div>
      <AllMovieCast movie_id={movie_id} />
    </div>
  );
};

export default AllMovieCastPage;
