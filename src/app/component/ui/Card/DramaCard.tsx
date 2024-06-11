import Link from "next/link";
import React from "react";

const DramaCard = ({ result }: any) => {
  return (
    <>
      <div className="flex flex-col group relative shadow-lg text-white rounded-xl px-6 py-8 h-[250px] w-[200px] overflow-hidden cursor-pointer ">
        {result?.poster_path ||
        result?.backdrop_path ||
        result?.profile_path === null ? (
          <Link
            href={`/tv/${result?.id}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${
                result?.poster_path ||
                result?.backdrop_path ||
                result?.profile_path
              })`,
            }}
          />
        ) : (
          <Link
            href={`/tv/${result?.id}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/empty.jpg)",
            }}
          />
        )}
      </div>
      <div className="w-[200px] text-white mb-12">
        <h1 className="text-sm lg:text-md w-full text-black dark:text-white">
          {result?.title || result?.name}
        </h1>
        <p className="text-sm text-black dark:text-white">
          {result?.episode_count} Episodes
        </p>
      </div>
    </>
  );
};

export default DramaCard;
