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
    <div className="w-full h-full relative overflow-hidden rounded-lg shadow-md bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-3369705912051027"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-ad-layout="in-article"
      ></ins>
      {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">
          Advertisement
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Your ad could be here
        </div>
        <div className="mt-4 flex space-x-2">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse delay-300"></div>
        </div>
      </div> */}
    </div>
  );
};

export default AdArticle;
