import React from "react";

const PhotoLoading = () => {
  return (
    <div className="max-w-6xl mx-auto md:py-8 md:px-10 mt-5 relative overflow-hidden">
      <div className="border-2 rounded-lg bg-white px-2">
        <h1 className="text-2xl font-bold p-5 border-b-2 border-b-slate-200 "></h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full h-full">
          {new Array(20).fill(0).map((_, idx) => {
            return (
              <div className="m-2 h-full" key={idx}>
                <div className="w-full h-full">
                  <p className="w-full h-[300px] border-2 animate-pulse bg-slate-200"></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhotoLoading;
