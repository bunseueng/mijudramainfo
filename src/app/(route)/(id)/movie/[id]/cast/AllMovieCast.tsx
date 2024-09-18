"use client";

import {
  fetchAllPopularTvShows,
  fetchMovie,
  fetchMovieCastCredit,
  fetchMovieLanguages,
} from "@/app/actions/fetchMovieApi";
import { ShareButton } from "@/app/component/ui/Button/ShareButton";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
const Director = dynamic(() => import("@/app/component/ui/CastRole/Director"), {
  ssr: false,
});
const GuestRole = dynamic(
  () => import("@/app/component/ui/CastRole/GuestRole"),
  { ssr: false }
);
const MainRole = dynamic(() => import("@/app/component/ui/CastRole/MainRole"), {
  ssr: false,
});
const MovieArt = dynamic(() => import("@/app/component/ui/CastRole/MovieArt"), {
  ssr: false,
});
const MovieCamera = dynamic(
  () => import("@/app/component/ui/CastRole/MovieCamera"),
  { ssr: false }
);
const MovieSupportRole = dynamic(
  () => import("@/app/component/ui/CastRole/MovieSupportRole"),
  { ssr: false }
);
const Product = dynamic(() => import("@/app/component/ui/CastRole/Product"), {
  ssr: false,
});
const Screenwriter = dynamic(
  () => import("@/app/component/ui/CastRole/Screenwriter"),
  { ssr: false }
);
const Sound = dynamic(() => import("@/app/component/ui/CastRole/Sound"), {
  ssr: false,
});
const LazyImage = dynamic(() => import("@/components/ui/lazyimage"), {
  ssr: false,
});

const AllMovieCast = ({ movie_id }: any) => {
  const { data: movie } = useQuery({
    queryKey: ["movie", movie_id],
    queryFn: () => fetchMovie(movie_id),
  });
  const { data: cast } = useQuery({
    queryKey: ["movieCast", movie_id],
    queryFn: () => fetchMovieCastCredit(movie_id),
  });
  const { data: language } = useQuery({
    queryKey: ["movieLanguage", movie_id],
    queryFn: fetchMovieLanguages,
  });
  const { data: allTvShows } = useQuery({
    queryKey: ["movieCast", movie_id],
    queryFn: fetchAllPopularTvShows,
  });
  const crew = cast?.crew?.map((item: any) => item);
  const hours = Math.floor(movie?.runtime / 60);
  const minutes = movie?.runtime % 60;

  const formattedRuntime = `${hours}h ${minutes}mn`;

  if (!movie || !cast) {
    return <div>Loading...</div>; // Add loading state if data is being fetched
  }

  // Filter the crew array to find all directors
  const directors = crew?.filter(
    (item: any) => item?.known_for_department === "Directing"
  );
  const production = crew?.filter(
    (item: any) => item?.known_for_department === "Production"
  );
  const sound = crew?.filter(
    (item: any) => item?.known_for_department === "Sound"
  );
  const writer = crew?.filter(
    (item: any) => item?.known_for_department === "Creator"
  );
  const camera = crew?.filter(
    (item: any) => item?.known_for_department === "Camera"
  );
  const art = crew?.filter((item: any) => item?.known_for_department === "Art");

  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const allTvShowsArray = Array.isArray(allTvShows) ? allTvShows : [];

  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === movie.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;
  return (
    <div className="bg-slate-100 dark:bg-[#1e1e1e]">
      <div className=" bg-cyan-600 dark:bg-[#242424]">
        <div className="w-full container mx-auto flex items-center mt-0 px-2 py-2 lg:py-6">
          <div className="flex items-center lg:items-start px-2 cursor-default">
            <LazyImage
              src={`https://image.tmdb.org/t/p/${
                movie?.poster_path ? "w154" : "w300"
              }/${movie?.poster_path || movie?.backdrop_path}`}
              alt={`${movie?.title || movie?.name}'s Poster`}
              width={90}
              height={130}
              quality={100}
              priority
              className="w-[90px] h-[130px] bg-center object-center rounded-md"
            />
            <div className="flex flex-col pl-5 py-5">
              <h1 className="text-white text-xl font-bold">
                {movie?.title || movie?.name} (
                {getYearFromDate(movie?.first_air_date || movie?.release_date)})
              </h1>
              <Link
                prefetch={true}
                href={`/movie/${movie_id}`}
                className="flex items-center my-5 cursor-default"
              >
                <FaArrowLeft
                  className="text-white cursor-pointer opacity-75 hover:opacity-90"
                  size={20}
                />
                <p className="text-white font-bold pl-2 cursor-pointer opacity-75 hover:opacity-90">
                  Back to main
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1536px] mx-auto mt-0 px-2 py-2 lg:py-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start px-2">
          <div className="w-full h-full lg:w-[60] xl:w-[75%] rounded-md mr-2">
            <div className="p-5 border-b-2 border-slate-200 bg-sky-300 dark:bg-[#242424] dark:border-[#272727] rounded-md">
              <h1 className="text-xl text-sky-900 dark:text-[#2196f3] font-bold">
                {movie?.name || movie?.title}
              </h1>
            </div>
            <div className="flex flex-col xl:flex-row mb-5 dark:bg-[#242424]">
              <div className="w-full">
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Director
                </h1>
                {directors?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Director has not added to {movie?.name} yet.
                  </p>
                ) : (
                  <Director directors={directors} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Production
                </h1>
                {production?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Producer has not added to {movie?.name} yet.
                  </p>
                ) : (
                  <Product production={production} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Writer
                </h1>
                {writer?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Writer has not added to {movie?.name} yet.
                  </p>
                ) : (
                  <Screenwriter writer={writer} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Sound
                </h1>
                {sound?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Sound has not added to {movie?.name} yet.
                  </p>
                ) : (
                  <Sound sound={sound} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Art
                </h1>
                {art?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Art Designer has not added to {movie?.name} yet.
                  </p>
                ) : (
                  <MovieArt art={art} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Camera
                </h1>
                {camera?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Camera has not added to {movie?.name} yet.
                  </p>
                ) : (
                  <MovieCamera camera={camera} />
                )}
                <div className="w-full">
                  <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                    Main Role
                  </h1>
                  <MainRole cast={cast} />

                  <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                    Support Role
                  </h1>
                  {cast?.cast?.filter((cast: any) => cast?.order > 2)
                    ?.length === 0 ? (
                    <p className="text-black dark:text-white p-5">
                      Support Role has not added to this {movie?.name}
                    </p>
                  ) : (
                    <MovieSupportRole cast={cast} />
                  )}
                  <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                    Guest Role
                  </h1>
                  {cast?.cast?.filter(
                    (cast: any) =>
                      cast?.order > 2 && cast?.total_episode_count < 5
                  )?.length === 0 ? (
                    <p className="text-black dark:text-white p-5">
                      Guest Role has not added to this {movie?.name}
                    </p>
                  ) : (
                    <GuestRole cast={cast} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full lg:w-[40%] xl:w-[25%]">
            <div className="flex flex-col items-center content-center max-w-[97rem] mx-auto py-10 md:p-5 border rounded-md bg-white dark:bg-[#242424] p-2">
              <LazyImage
                src={`https://image.tmdb.org/t/p/${
                  movie?.poster_path ? "w154" : "w300"
                }/${movie?.poster_path || movie?.backdrop_path}`}
                alt={`${movie?.poster_path}'s Poster`}
                width={350}
                height={480}
                quality={100}
                priority
                className="block align-middle w-[350px] h-[480px] rounded-lg"
              />
              <div className="mt-2 flex items-center justify-between">
                <ShareButton
                  movie={`https://image.tmdb.org/t/p/${
                    movie?.poster_path ? "w154" : "w300"
                  }/${movie?.poster_path || movie?.backdrop_path}`}
                />
              </div>
            </div>
            <div className="border border-slate-400 dark:bg-[#242424] dark:border-[#272727] h-full rounded-md mt-4">
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
                    {movie?.production_countries?.map(
                      (item: any) => item?.name
                    )}
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
            <div className="border border-slate-400 dark:bg-[#242424] dark:border-[#272727] h-full rounded-md mt-4">
              <h1 className="text-white text-2xl font-bold bg-cyan-600 p-4 rounded-t-md">
                Statistics:
              </h1>
              <div className="flex flex-col p-4 pb-1">
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2">Score:</h1>
                  <p className="font-semibold">
                    {movie?.vote_average.toFixed(2)}{" "}
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
    </div>
  );
};

export default AllMovieCast;
