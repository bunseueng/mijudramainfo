"use client";

import React, { Suspense } from "react";
import RingLoader from "react-spinners/RingLoader";

const SearchLoading = () => {
  return (
    <Suspense>
      <div className="h-screen relative px-4 border">
        <div className="absolute inset-0 w-4 h-4 mx-auto my-auto pb-[50px]">
          <RingLoader color="#36d7b7" />
        </div>
      </div>
    </Suspense>
  );
};

export default SearchLoading;
