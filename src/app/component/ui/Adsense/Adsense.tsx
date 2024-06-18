import Script from "next/script";
import React from "react";

type AdsenseType = {
  pId: string;
};

const Adsense = ({ pId }: AdsenseType) => {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    ></Script>
  );
};

export default Adsense;
