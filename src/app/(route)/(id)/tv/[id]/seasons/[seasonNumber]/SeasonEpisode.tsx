"use client";

import { fetchSeasonEpisode, fetchTv } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaArrowCircleDown, FaArrowLeft } from "react-icons/fa";

const SeasonEpisode = () => {
  const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);
  const path = usePathname();

  // Use useRouter to get current URL path
  const pathParts = path ? path.split("/") : [];
  const tv_id = pathParts[2] || ""; // Assuming the tv_id is at index 2 in the path
  const season_number = pathParts[4] || ""; // Assuming the season number is at index 4 in the path
  const {
    data: season,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["season"],
    queryFn: () => fetchSeasonEpisode(tv_id, season_number),
  });
  const { data: tv } = useQuery({
    queryKey: ["tv", tv_id],
    queryFn: () => fetchTv(tv_id),
  });

  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const handleExpand = (episodeNumber: number) => {
    const newUrl = `/tv/${tv.id}/seasons/${season.season_number}/episode/${episodeNumber}`;
    window.history.pushState({}, "", newUrl);
    setExpandedEpisode(episodeNumber);
  };

  useEffect(() => {
    // Reset expanded episode when route changes
    setExpandedEpisode(null);

    // Refetch season data when route changes
    refetch();
  }, [tv_id, season_number, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-cyan-600">
        <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center lg:items-start">
            <Image
              src={`https://image.tmdb.org/t/p/original/${season?.poster_path}`}
              alt={`${tv?.name}'s Poster`}
              width={200}
              height={200}
              quality={100}
              className="w-[90px] h-[130px] bg-center object-center rounded-md"
            />
            <div className="flex flex-col pl-5 py-5">
              <h1 className="text-white text-2xl font-bold">
                {season?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv?.id}/seasons`}
                className="flex items-center my-5 opacity-75 cursor-pointer hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to season list</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1520px] mx-auto py-4 px-4 md:px-6">
        <h1 className="text-2xl text-black font-bold mt-3">
          Episodes {season?.episodes?.length}
        </h1>
        {season?.episodes?.map((item: any, idx: number) => {
          return (
            <div
              className="border-2 border-slate-500 rounded-lg my-10"
              key={idx}
            >
              <div className="flex flex-col md:flex-row items-start">
                <Image
                  src={`https://image.tmdb.org/t/p/original/${item?.still_path}`}
                  alt={`${tv?.name}'s Poster`}
                  width={250}
                  height={250}
                  quality={100}
                  className="w-full h-full md:w-[200px] md:h-[130px] bg-cover object-cover rounded-tl-md"
                />
                <div className="w-full">
                  <div className="flex items-start mt-5 ml-5">
                    <p className="text-lg font-semibold">{idx + 1}</p>
                    <div className="flex flex-col items-start pl-4">
                      <h1 className="text-lg font-bold">
                        Episode {item?.episode_number}
                      </h1>
                      <div className="flex items-center mt-2">
                        <h4 className="bg-black p-1 rounded-full flex flex-row items-center">
                          <BsStars className="text-white" size={15} />
                          <span className="text-white text-xs px-2">
                            {item?.vote_average.toFixed(1)}
                          </span>
                        </h4>
                        <p className="px-2">{item?.air_date}</p>
                        <span> • </span>
                        <p className="px-2">{item?.runtime}</p>
                      </div>
                    </div>
                  </div>
                  {item?.overview === "" ? (
                    <p className="text-md font-semibold px-4 pt-4">
                      We dont have an overview translated in English.
                    </p>
                  ) : (
                    <p className="text-md font-semibold px-4 pt-4">
                      {item?.overview}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-t-2 border-t-slate-500">
                <div
                  className="flex items-center justify-center cursor-pointer"
                  onClick={() => handleExpand(item?.episode_number)}
                >
                  {expandedEpisode !== item?.episode_number && (
                    <>
                      <p className="text-md font-bold py-2">Expand</p>
                      <FaArrowCircleDown className="ml-2" />
                    </>
                  )}
                </div>
              </div>
              {expandedEpisode === item?.episode_number && (
                <>
                  <div className="w-full">
                    <ul className="flex items-center justify-between px-4 py-2 border-b-2 border-b-slate-500">
                      <li className="hover:opacity-70 transform duration-300">
                        <Link
                          href={`https://www.themoviedb.org/tv/${tv?.id}/season/${season?.season_number}/episode/${item?.episode_number}/videos`}
                        >
                          Videos
                        </Link>
                      </li>
                      <li className="hover:opacity-70 transform duration-300">
                        <Link
                          href={`https://www.themoviedb.org/tv/${tv?.id}/season/${season?.season_number}/episode/${item?.episode_number}/images/backdrops`}
                        >
                          Images
                        </Link>
                      </li>
                      <li className="hover:opacity-70 transform duration-300">
                        <Link
                          href={`https://www.themoviedb.org/tv/${tv?.id}/season/${season?.season_number}/episode/${item?.episode_number}/changes`}
                        >
                          Changes
                        </Link>
                      </li>
                      <li className="hover:opacity-70 transform duration-300">
                        <Link
                          href={`https://www.themoviedb.org/tv/${tv?.id}/season/${season?.season_number}/episode/${item?.episode_number}/#`}
                        >
                          Report
                        </Link>
                      </li>
                      <li className="hover:opacity-70 transform duration-300">
                        <Link
                          href={`https://www.themoviedb.org/tv/${tv?.id}/season/${season?.season_number}/episode/${item?.episode_number}/edit?active_nav_item=primary_facts`}
                        >
                          Edit
                        </Link>
                      </li>
                    </ul>
                    <div className="flex items-start">
                      <div className="w-full md:w-[40%] p-5">
                        <h1 className="text-md font-bold">
                          Crew: <span>{item?.crew?.length}</span>
                        </h1>
                        {item?.crew?.length === 0 ? (
                          <h1 className="text-sm font-bold">
                            Directed By:{" "}
                            <span className="text-sm font-semibold">
                              No director has been added.
                            </span>
                          </h1>
                        ) : (
                          <div>
                            {item?.crew
                              ?.filter(
                                (crew: any) =>
                                  crew?.known_for_department === "Directing"
                              )
                              .map((crewItem: any, idx: number) => (
                                <div className="flex items-center" key={idx}>
                                  <Image
                                    src={`https://image.tmdb.org/t/p/original/${crewItem?.profile_path}`}
                                    alt="profile image"
                                    width={150}
                                    height={150}
                                    className="w-[90px] h-[70px] rounded-md"
                                  />
                                  <div className="ml-4">
                                    <p className="text-sm font-semibold">
                                      {crewItem?.name}
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {crewItem?.known_for_department}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                        {item?.crew?.length === 0 ? (
                          <h1 className="text-sm font-bold">
                            Directed By:{" "}
                            <span className="text-sm font-semibold">
                              No writer has been added.
                            </span>
                          </h1>
                        ) : (
                          <div>
                            {item?.crew
                              ?.filter(
                                (crew: any) =>
                                  crew?.known_for_department === "Creator"
                              )
                              .map((crewItem: any, idx: number) => (
                                <div className="flex items-center" key={idx}>
                                  <Image
                                    src={`https://image.tmdb.org/t/p/original/${crewItem?.profile_path}`}
                                    alt="profile image"
                                    width={150}
                                    height={150}
                                    className="w-[90px] h-[70px] rounded-md"
                                  />
                                  <div className="ml-4">
                                    <p className="text-sm font-semibold">
                                      {crewItem?.name}
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {crewItem?.known_for_department}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-[40%] p-5">
                        <h1 className="text-md font-bold">
                          Guest Stars {item?.guest_stars?.length}
                        </h1>
                        {item?.guest_stars?.length === 0 ? (
                          <p className="text-sm font-bold">
                            No guest stars have been added.
                          </p>
                        ) : (
                          <div>
                            {item?.guest_stars?.map(
                              (guest: any, idx: number) => (
                                <div className="flex items-center" key={idx}>
                                  <Image
                                    src={`https://image.tmdb.org/t/p/original/${guest?.profile_path}`}
                                    alt="profile image"
                                    width={150}
                                    height={150}
                                    className="w-[90px] h-[70px] rounded-md"
                                  />
                                  <div className="ml-4">
                                    <p className="text-sm font-semibold">
                                      {guest?.name}
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {guest?.character}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-[20%] text-end py-5 px-4">
                        <Link
                          href={`${path}/cast`}
                          className="text-sm font-bold hover:opacity-70 cursor-pointer"
                        >
                          View all Cast & Crew
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonEpisode;
