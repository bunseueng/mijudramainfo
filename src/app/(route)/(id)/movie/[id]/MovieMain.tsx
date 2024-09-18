"use client";

import { FaRegKissWinkHeart } from "react-icons/fa";
import { MdBookmarkAdd, MdFormatListBulletedAdd } from "react-icons/md";
import {
  fetchMovie,
  fetchMovieCastCredit,
  fetchMovieImages,
  fetchMovieKeyword,
  fetchMovieLanguages,
  fetchMovieRecommendation,
  fetchMovieReview,
  fetchMovieTitle,
  fetchMovieTrailer,
  fetchMovieVideos,
  fetchRecommendation,
} from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
const CircleRating = dynamic(
  () => import("@/app/component/ui/CircleRating/CircleRating"),
  { ssr: false }
);
const PlayTrailerBtn = dynamic(() => import("../../tv/[id]/PlayTrailerBtn"), {
  ssr: false,
});
const MovieCast = dynamic(() => import("./MovieCast"), { ssr: false });
const LazyImage = dynamic(() => import("@/components/ui/lazyimage"), {
  ssr: false,
});

export const getYearFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getFullYear();
};

const MovieMain = ({ movie_id, user, users, getComment }: any) => {
  const { data: movie } = useQuery({
    queryKey: ["movie", movie_id],
    queryFn: () => fetchMovie(movie_id),
  });
  const { data: trailer } = useQuery({
    queryKey: ["movieTrailer", movie_id],
    queryFn: () => fetchMovieTrailer(movie_id),
  });
  const { data: cast } = useQuery({
    queryKey: ["movieCast", movie_id],
    queryFn: () => fetchMovieCastCredit(movie_id),
  });
  const { data: language } = useQuery({
    queryKey: ["movieLanguage"],
    queryFn: () => fetchMovieLanguages(),
  });
  const { data: keyword } = useQuery({
    queryKey: ["movieKeyword", movie_id],
    queryFn: () => fetchMovieKeyword(movie_id),
  });
  const { data: title } = useQuery({
    queryKey: ["movieTitle", movie_id],
    queryFn: () => fetchMovieTitle(movie_id),
  });
  const { data: review } = useQuery({
    queryKey: ["movieReview", movie_id],
    queryFn: () => fetchMovieReview(movie_id),
  });
  const { data: image } = useQuery({
    queryKey: ["movieImage", movie_id],
    queryFn: () => fetchMovieImages(movie_id),
  });
  const { data: video } = useQuery({
    queryKey: ["movieVideo", movie_id],
    queryFn: () => fetchMovieVideos(movie_id),
  });
  const { data: recommend } = useQuery({
    queryKey: ["movieRecommend", movie_id],
    queryFn: () => fetchMovieRecommendation(movie_id),
  });
  const { data: allTvShows } = useQuery({
    queryKey: ["allTvShows"],
    queryFn: fetchRecommendation,
  });
  // Getting Crew
  const castCredit = cast?.crew?.map((item: any) => item);
  const director = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Directing"
  );
  const screenwriter = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Creator"
  );

  const keywords = keyword?.keywords;

  const formattedKeywords = keywords?.map((key: any, index: number) => {
    // Capitalize the first letter of the keyword
    const capitalizedKeyword =
      key.name.charAt(0).toUpperCase() + key.name.slice(1);
    // Add comma after each item except for the last one
    return index === keywords?.length - 1
      ? capitalizedKeyword
      : capitalizedKeyword + ", ";
  });
  const genres = movie?.genres;

  const hours = Math.floor(movie?.runtime / 60);
  const minutes = movie?.runtime % 60;

  const formattedRuntime = `${hours}h ${minutes}mn`; // Result: "2h 28mn"
  return (
    <>
      <div className="w-full h-full">
        <div
          className="relative overflow-hidden bg-cover bg-no-repeat h-auto"
          style={{
            backgroundPosition: "calc(50vw - 510px) top",
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${
              movie?.backdrop_path || movie?.poster_path
            })`,
          }}
        >
          <div
            className="w-full flex flex-wrap items-center justify-center h-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(24, 40, 72, 1) calc((50vw - 170px) - 340px), rgba(24, 40, 72, 0.84) 50%, rgba(24, 40, 72, 0.84) 100%)",
            }}
          >
            <div className="flex flex-col md:flex-row content-center max-w-[97rem] mx-auto py-10 md:py-8 md:px-10">
              <LazyImage
                src={`https://image.tmdb.org/t/p/${
                  movie?.poster_path ? "w154" : "w300"
                }/${movie?.poster_path || movie?.backdrop_path}`}
                alt={`${movie?.name || movie?.title}'s Poster`}
                width={350}
                height={480}
                quality={100}
                priority
                className="block align-middle w-[350px] h-[480px] rounded-lg pl-8 md:pl-0"
              />
              <div className="px-8 py-5">
                <div className="mb-2 relative">
                  <h2 className="text-3xl mb-3 font-bold text-white">
                    {movie?.title || movie?.name} (
                    {getYearFromDate(
                      movie?.first_air_date || movie?.release_date
                    )}
                    )
                  </h2>
                </div>
                <div className="mb-2 text-1xl font-bold text-white">
                  {movie?.genres?.map((genre: any, index: number) => {
                    return index === genres.length - 1
                      ? genre.name
                      : genre.name + ", ";
                  })}
                  <span className="px-2">•</span>
                  <span>{formattedRuntime}</span>
                </div>
                <div className="flex items-center py-5">
                  <CircleRating
                    rating={
                      movie?.vote_average < 1
                        ? "NR"
                        : movie?.vote_average?.toFixed(1)
                    }
                  />
                  <p className="text-white text-1xl font-bold uppercase pl-5">
                    From {movie?.vote_count}
                    {movie?.vote_count < 2 ? " user" : " users"}
                  </p>
                </div>
                <div className="flex items-center mt-2 mb-8">
                  <p className="w-10 p-2 mr-5 rounded-full bg-cyan-600 text-white">
                    <MdFormatListBulletedAdd size={25} />
                  </p>
                  <p className="w-10 p-2 mr-5 rounded-full bg-cyan-600 text-white">
                    <FaRegKissWinkHeart size={25} />
                  </p>
                  <p className="w-10 p-2 mr-5 rounded-full bg-cyan-600 text-white">
                    <MdBookmarkAdd size={25} />
                  </p>
                  {/* Play Trailer Button  */}
                  <PlayTrailerBtn trailer={trailer} />
                </div>
                <p className="mb-3 text-2xl mt-3">
                  <span className="text-white font-bold">Overview:</span>
                </p>
                <p className="text-lg text-white mb-3">{movie?.overview}</p>
                <div className="border-t-2 pt-4">
                  <h1 className="text-white font-bold text-md">
                    Navtive Title:
                    <span className="text-sm pl-2 font-normal text-blue-300">
                      {movie?.original_name || movie?.original_title}
                    </span>
                  </h1>
                </div>
                <div className="mt-4">
                  <h1 className="text-white font-bold text-md">
                    Also Known As:
                    <span className="text-sm pl-2 font-normal text-blue-300">
                      {title?.titles?.map((title: any, index: number) => (
                        <span key={index}>
                          {index > 0 && ", "}
                          {title?.title}
                        </span>
                      ))}
                    </span>
                  </h1>
                </div>
                <div className="mt-4">
                  <h1 className="text-white font-bold text-md">
                    Director:
                    <span className="text-sm pl-2 font-normal text-blue-300">
                      {director?.name}
                    </span>
                  </h1>
                </div>
                <div className="mt-4">
                  <h1 className="text-white font-bold text-md">
                    Screenwriter:
                    <span className="text-sm pl-2 font-normal text-blue-300">
                      {screenwriter?.name}
                    </span>
                  </h1>
                </div>
                <div className="mt-4">
                  <h1 className="text-white font-bold text-md">
                    Genres:
                    <span className="text-sm pl-2 font-normal text-blue-300">
                      {movie?.genres?.map((genre: any, index: number) => {
                        return index === genres.length - 1
                          ? genre.name
                          : genre.name + ", ";
                      })}
                    </span>
                  </h1>
                </div>
                <div className="mt-4">
                  <h1 className="text-white font-bold text-md">
                    Tags:
                    <span className="text-sm pl-2 font-normal text-blue-300">
                      {formattedKeywords}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Cast */}
      </div>
      <div>
        <MovieCast
          cast={cast}
          movie={movie}
          language={language}
          allTvShows={allTvShows}
          review={review}
          movie_id={movie_id}
          image={image}
          video={video}
          recommend={recommend}
          user={user}
          users={users}
          getComment={getComment}
        />
      </div>
    </>
  );
};

export default MovieMain;
