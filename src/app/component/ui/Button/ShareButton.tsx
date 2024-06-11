"use client";

import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import React from "react";

export const ShareButton = ({ tv }: any) => {
  const currentPage = "https://mijudramalist.com";
  return (
    <>
      <FacebookShareButton
        url={currentPage}
        quote="The best site to find your favorite drama"
        hashtag="#drama"
      >
        <FacebookIcon round={true} size={50} className="mx-4" />
      </FacebookShareButton>
      <TwitterShareButton
        url={currentPage}
        hashtags={["drama", "list"]}
        title="The best site to find your favorite drama"
      >
        <TwitterIcon round={true} size={50} className="mx-4" />
      </TwitterShareButton>
      <RedditShareButton
        url={currentPage}
        title="The best site to find your favorite drama"
      >
        <RedditIcon round={true} size={50} className="mx-4" />
      </RedditShareButton>
      <PinterestShareButton
        url={currentPage}
        media={tv}
        title="The best site to find your favorite drama"
      >
        <PinterestIcon round={true} size={50} className="mx-4" />
      </PinterestShareButton>
    </>
  );
};
