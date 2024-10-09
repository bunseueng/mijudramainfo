"use client";

import { fetchMovie } from "@/app/actions/fetchMovieApi";
import { editPageList } from "@/helper/item-list";
import { Movie, movieId } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState, useEffect, lazy } from "react";
import { VscQuestion } from "react-icons/vsc";
import { useRouter, usePathname } from "next/navigation";
import MovieDetails from "./MovieDetails";
import MovieCover from "../cover/MovieCover";
import MovieCrew from "../crew/MovieCrew";
import MovieCast from "../cast/MovieCast";
const RelatedTitle = lazy(() => import("../related/RelatedTitle"));
const MovieServices = lazy(() => import("../services/MovieServices"));
const ReleaseInfo = lazy(() => import("../release/ReleaseInfo"));
const Production = lazy(() => import("../production/Production"));
const Genres = lazy(() => import("../genres/Genres"));
const ExternalLink = lazy(() => import("../external_link/ExternalLink"));

const MovieEditList: React.FC<movieId & Movie> = ({
  movie_id,
  movieDetails,
}) => {
  const [currentPage, setCurrentPage] = useState("/detail");
  const { data: movie } = useQuery({
    queryKey: ["movieEdit", movie_id],
    queryFn: () => fetchMovie(movie_id),
  });

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    setCurrentPage(link);
    router.push(`/movie/${movie?.id}/edit/${link}`);
  };

  useEffect(() => {
    if (pathname) {
      const pathArray = pathname.split("/");
      const newPage = `/${pathArray[pathArray.length - 1]}`;
      setCurrentPage(newPage);
    }
  }, [pathname]);

  return (
    <div className="w-full h-[100%]">
      <div className="w-full relative h-auto float-right bg-white dark:bg-[#242526] border-2 border-slate-200 dark:border-[#232426] shadow-sm rounded-b-md">
        <div className="px-3 mb-2">
          <h1 className="text-2xl font-semibold pt-3 mb-2">
            <Link prefetch={true} href={`/movie/${movie?.id}`}>
              {movie?.title || movie?.name}
            </Link>
          </h1>
        </div>
        <div className="relative float-left w-full md:w-[25%] py-3 px-4">
          <div className="bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#242527] rounded-sm px-4 py-2">
            <div className="flex items-center justify-between">
              <h1>Edit</h1>
              <VscQuestion />
            </div>
          </div>
          <ul className="pt-3">
            {editPageList?.map((item, idx) => (
              <li
                key={idx}
                className={`pb-2 ${
                  currentPage === item?.link
                    ? "text-[#1675b6]"
                    : "text-black dark:text-white"
                }`}
              >
                <Link
                  prefetch={true}
                  href={`/movie/${movie?.id}/edit/${item?.link}`}
                  className="text-md"
                  shallow
                  onClick={(e) => handleNavigation(e, item.link)}
                >
                  <span className="inline-block text-center mr-5 md:mr-3 lg:mr-5">
                    {item?.icon}
                  </span>
                  <span className="text-center md:text-sm lg:text-md">
                    {item?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative float-left w-full md:w-[75%] -px-3">
          {currentPage === "/detail" ? (
            <MovieDetails movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/cover" ? (
            <MovieCover movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/related" ? (
            <RelatedTitle movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/cast" ? (
            <MovieCast movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/crew" ? (
            <MovieCrew movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/services" ? (
            <MovieServices movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/release" ? (
            <ReleaseInfo movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/production" ? (
            <Production movie_id={movie_id} movieDetails={movieDetails} />
          ) : currentPage === "/genres" ? (
            <Genres movie_id={movie_id} movieDetails={movieDetails as any} />
          ) : currentPage === "/external_link" ? (
            <ExternalLink movie_id={movie_id} movieDetails={movieDetails} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MovieEditList;
