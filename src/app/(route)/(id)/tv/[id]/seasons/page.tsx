import React from "react";
import dynamic from "next/dynamic";
const GetSeason = dynamic(() => import("./GetSeason"), { ssr: false });

const SeasonPage = () => {
  return <GetSeason />;
};

export default SeasonPage;
