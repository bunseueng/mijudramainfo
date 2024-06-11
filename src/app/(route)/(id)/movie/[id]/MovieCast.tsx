import CastCard from "@/app/component/ui/Card/CastCard";
import Link from "next/link";
import React from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import ReviewCard from "@/app/component/ui/Card/ReviewCard";

const MovieCast = ({
  cast,
  movie,
  language,
  allTvShows,
  movie_id,
  review,
  image,
  video,
  recommend,
  user,
  users,
  getComment,
}: any) => {
  const allTvShowsArray = Array.isArray(allTvShows) ? allTvShows : [];

  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === movie.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;

  if (!movie || !language || !allTvShows || !review || !image) {
    return null;
  }
  const hours = Math.floor(movie?.runtime / 60);
  const minutes = movie?.runtime % 60;

  const formattedRuntime = `${hours}h ${minutes}mn`;

  return (
    <div className="max-w-[97rem] mx-auto md:py-8 md:px-10 mt-5 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start">
        <div className="w-full lg:w-[70%]">
          <div className="lg:w-[92%] flex items-center justify-between content-center px-2 lg:px-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
                Cast & Credits
              </h1>
              <FaArrowAltCircleRight size={30} className="ml-2 font-bold" />
            </div>
            <Link
              href={`/movie/${movie_id}/cast`}
              className="text-lg font-bold"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 min-[649px]:grid-cols-2 min-[1350px]:grid-cols-3 ml-5 md:ml-0">
            <CastCard cast={cast} />
          </div>
          <div className="border-b-2 border-b-slate-500 pb-5 mt-5 mx-2 md:mx-0"></div>
          <div className="py-5 mx-2 md:mx-0">
            <ReviewCard
              user={user}
              users={users}
              review={review}
              image={image}
              video={video}
              tv_id={movie_id}
              recommend={recommend}
              movie={movie}
              getComment={getComment}
            />
          </div>
        </div>
        <div className="w-full px-2 lg:w-[30%] my-5 md:my-0 lg:ml-5">
          <div className="border border-slate-400 h-full rounded-md">
            <h1 className="text-white text-2xl font-bold bg-cyan-600 p-4">
              Details:
            </h1>
            <div className="flex flex-col p-4 pb-1">
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">
                  Drama:{" "}
                  <span className="text-md font-semibold">
                    {movie?.title || movie?.name}
                  </span>
                </h1>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Country:</h1>
                <p className="font-semibold">
                  {movie?.production_countries?.map((item: any) => item?.name)}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Budget:</h1>
                <p className="font-semibold">${movie?.budget}</p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Revenue:</h1>
                <p className="font-semibold">${movie?.revenue}</p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Released Date:</h1>
                <p className="font-semibold">{movie?.release_date}</p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Duration:</h1>
                <p className="font-semibold">{formattedRuntime}</p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Status:</h1>
                <p className="font-semibold">
                  {movie?.status === "Returning Series"
                    ? "Ongoing"
                    : movie?.status}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-slate-400 h-full mt-5 rounded-md">
            <h1 className="text-white text-2xl font-bold bg-cyan-600 p-4">
              Statistics:
            </h1>
            <div className="flex flex-col p-4 pb-1">
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Score:</h1>
                <p className="font-semibold">
                  {movie?.vote_average?.toFixed(1)}{" "}
                  {movie?.vote_average === 0
                    ? ""
                    : `(scored by ${movie?.vote_count} ${
                        movie?.vote_count < 2 ? " user" : " users"
                      })`}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Ranked:</h1>
                <p className="font-semibold">#{!rank ? "10000+" : rank}</p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-lg font-bold pr-2">Popularity:</h1>
                <p className="font-semibold">#{movie?.popularity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCast;
