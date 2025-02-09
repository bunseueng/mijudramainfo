"use client";

import { fetchMovie } from "@/app/actions/fetchMovieApi";
import { editPageList } from "@/helper/item-list";
import { Movie, movieId } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState, useEffect, lazy, Suspense } from "react";
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
  const [currentPage, setCurrentPage] = useState("/edit");
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movieEdit", movie_id],
    queryFn: () => fetchMovie(movie_id),
    gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    setCurrentPage(link);
    router.push(`/movie/${movie?.id}/edit${link}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (pathname) {
      const pathArray = pathname.split("/");
      const newPage = `/${pathArray[pathArray.length - 1]}`;
      setCurrentPage(newPage);
    }
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const components = {
    "/edit": MovieDetails,
    "/detail": MovieDetails,
    "/cover": MovieCover,
    "/related": RelatedTitle,
    "/cast": MovieCast,
    "/crew": MovieCrew,
    "/services": MovieServices,
    "/release": ReleaseInfo,
    "/production": Production,
    "/genres": Genres,
    "/external_link": ExternalLink,
  };

  const Component = components[currentPage as keyof typeof components];

  return (
    <div className="w-full h-full">
      <div className="w-full relative h-auto float-right bg-background border border-border shadow-sm rounded-b-md">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-semibold">
            <Link
              href={`/movie/${movie?.id}`}
              className="hover:text-primary transition-colors"
            >
              {movie?.title || movie?.name}
            </Link>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 p-4">
            <div className="bg-card border border-border rounded-md px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium">Edit</h2>
                <VscQuestion className="text-muted-foreground" />
              </div>

              <nav>
                <ul className="space-y-2">
                  {editPageList?.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={`/movie/${movie?.id}/edit${item.link}`}
                        className={`flex items-center px-2 py-1.5 rounded-md transition-colors ${
                          currentPage === item.link
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        }`}
                        onClick={(e) => handleNavigation(e, item.link)}
                      >
                        <span className="inline-flex items-center justify-center w-8">
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="flex-1 p-4">
            {Component && (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-full h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <Component
                  movie_id={movie_id}
                  movieDetails={movieDetails as any}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEditList;
