"use client";

import React, { useEffect } from "react";

type AdBannerType = {
  dataAdSlot: string;
  dataAdFormat: string;
};

const AdBanner = ({ dataAdSlot, dataAdFormat }: AdBannerType) => {
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
      style={{ display: "block" }}
      data-ad-client="ca-pub-9500233280708226"
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdBanner;
