import React from "react";
import RingLoader from "react-spinners/RingLoader";

const SearchLoading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <RingLoader color="#36d7b7" />
    </div>
  );
};

export default SearchLoading;
