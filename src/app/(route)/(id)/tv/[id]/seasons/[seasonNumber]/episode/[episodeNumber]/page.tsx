import React from "react";
import dynamic from "next/dynamic";
const SeasonEpisode = dynamic(() => import("../../SeasonEpisode"), {
  ssr: false,
});

const EpisodePage = () => {
  return <SeasonEpisode />;
};

export default EpisodePage;
