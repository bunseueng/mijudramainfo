import { getGenreName } from "@/lib/getGenres";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

interface HoemCardHover {
  categoryData: any;
  path: string;
  dominantColor: { [key: string]: string };
  getRating: (result: any) => string;
  hoveredCard: number | null;
  hoverPosition: { x: number; y: number };
}
const HomeCardHover = ({
  categoryData,
  path,
  dominantColor,
  getRating,
  hoverPosition,
  hoveredCard,
}: HoemCardHover) => {
  return (
    <div
      className="fixed w-[286px] block max-w-[396px] z-[999] shadow-xl"
      style={{
        top: hoverPosition.y,
        left: hoverPosition.x,
        pointerEvents: "none",
        opacity: hoveredCard ? 1 : 0,
        transform: `scale(${hoveredCard ? 1 : 0.95})`,
        transition:
          "transform 0.01s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.01s ease-in-out",
        transformOrigin: "center center",
      }}
    >
      {categoryData?.results
        ?.filter((result: any) => result.id === hoveredCard)
        .map((result: any) => (
          <div
            key={result.id}
            className="flex flex-wrap overflow-hidden rounded-sm"
          >
            <Link
              className="w-full"
              prefetch={false}
              aria-label={
                `Visit ${result?.name || result?.title}?` || "Visit Drama Page"
              }
              title={
                `Visit ${result?.name || result?.title}?` || "Visit Drama Page"
              }
              href={`/${path}/${result?.id}-${spaceToHyphen(
                result?.name || result?.title
              )}`}
            >
              <div className="relative w-full">
                <div
                  className="w-full"
                  style={{
                    background: dominantColor[result.id] || "transparent",
                  }}
                >
                  <div
                    className="pt-[56%] w-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/${
                        result?.poster_path ? "w500" : "w780"
                      }${result?.backdrop_path || result?.poster_path})`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative w-full h-[258px] flex border-box">
                <div className="relative w-full bg-[#1a1c22] rounded-b-sm p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                    {result?.title || result?.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-white font-semibold">
                        {getRating(result)}
                      </span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-200">
                      {result?.first_air_date ? (
                        result.first_air_date.split("-")[0]
                      ) : (
                        <span className="text-blue-400">Upcoming</span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {result.genre_ids.map((genreId: string) => {
                      const genreName = getGenreName(genreId);
                      return genreName ? (
                        <span
                          key={genreId}
                          className="text-xs px-2 py-1 bg-gray-700/50 text-gray-200 rounded"
                        >
                          {genreName}
                        </span>
                      ) : null;
                    })}
                  </div>

                  <section className="flex flex-wrap justify-end content-between w-full h-[118px] mt-2 grow">
                    <p className="w-full mb-2 text-sm text-white font-normal whitespace-normal line-clamp-5 leading-5 overflow-hidden">
                      {result?.overview.length > 125
                        ? result?.overview.slice(0, 125) + "..."
                        : result?.overview}
                    </p>
                  </section>

                  <div className="absolute bottom-4 right-4 flex items-center text-green-400 hover:text-green-300 transition-colors">
                    <span className="text-sm mr-1">More info</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default HomeCardHover;
