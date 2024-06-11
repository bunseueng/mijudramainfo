import React from "react";

const VarietyShowCard = ({ result }: any) => {
  return (
    <>
      <div className="flex flex-col group relative shadow-lg text-white rounded-xl px-6 py-8 h-[250px] w-[200px] overflow-hidden cursor-pointer ">
        {result?.backdrop_path ||
        result?.poster_path ||
        result?.profile_path === null ? (
          <div
            className="absolute inset-0 bg-cover bg-center object-cover"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${
                result?.backdrop_path ||
                result?.poster_path ||
                result?.profile_path
              })`,
            }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/empty.jpg)",
            }}
          />
        )}
      </div>
      <div className="w-[200px] text-white mb-12">
        <h1 className="text-sm lg:text-md w-full text-black">
          {result?.title || result?.name}
        </h1>
        <p className="text-sm">{result?.first_air_date}</p>
      </div>
    </>
  );
};

export default VarietyShowCard;
