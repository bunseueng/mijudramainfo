"use client";

import React, { useEffect } from "react";

type AdArticleType = {
  dataAdSlot: string;
  dataAdFormat: string;
};

const AdArticle = ({ dataAdSlot, dataAdFormat }: AdArticleType) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error: any) {
      console.log(error?.message);
    }
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center" }}
      data-ad-client="ca-pub-9500233280708226"
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-ad-layout="in-article"
    ></ins>
  );
};

export default AdArticle;
