import Script from "next/script";
import React from "react";

type AdsenseType = {
  pId: string;
};

const Adsense = async ({ pId }: AdsenseType) => {
  return (
    <Script
      defer
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    ></Script>
  );
};

export default Adsense;
