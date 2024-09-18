import React from "react";
import dynamic from "next/dynamic";
const EpisodeCast = dynamic(() => import("./EpisodeCast"), {
  ssr: false,
});

const EpisodeCastPage = () => {
  return <EpisodeCast />;
};

export default EpisodeCastPage;
