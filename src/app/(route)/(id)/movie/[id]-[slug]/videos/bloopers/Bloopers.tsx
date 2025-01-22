"use client";

import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { CiPlay1 } from "react-icons/ci";
import { formatDuration } from "@/app/actions/formattedDuration";
import { fetchMovieTrailer } from "@/app/actions/fetchMovieApi";
import { FaYoutube } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/app/actions/formatDate";
import { DramaReleasedInfo } from "@/helper/type";
import dynamic from "next/dynamic";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { Metadata } from "next";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export async function generateMetadata({
  params,
}: {
  params: { "id]-[slug": string };
}): Promise<Metadata> {
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }

  const [movie_id] = params["id]-[slug"].split("-");
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const tvDetails = await response.json();
  const original_country = tvDetails?.origin_country?.[0];
  const getLanguage = await fetch(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const language = await getLanguage.json();
  const matchedCountry = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );

  const countryToLanguageMap: { [key: string]: string } = {
    China: "Chinese",
    Korea: "Korean",
    Japan: "Japanese",
    Taiwan: "Taiwanese",
    Thai: "Thailand",
    // Add more mappings as needed
  };
  // Get the language name
  const languageName =
    countryToLanguageMap[matchedCountry?.english_name] ||
    matchedCountry?.english_name;

  if (!response) {
    throw new Error("Network response was not ok");
  }

  return {
    title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})'s Bloopers`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data?.name),
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/tv/${tvDetails?.id}`,
      title: tvDetails?.title,
      description: tvDetails?.overview,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${tvDetails?.backdrop_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

interface Youtube {
  thumbnailUrl: string;
  channelName: string;
  duration: string;
}

interface TvTrailerType {
  movie_id: string;
  movie: DramaReleasedInfo;
}

const MovieBloopers: React.FC<TvTrailerType> = ({ movie_id, movie }) => {
  const { data: movieTrailer, isLoading } = useQuery({
    queryKey: ["movieTrailer"],
    queryFn: () => fetchMovieTrailer(movie_id),
  });
  const [openTrailer, setOpenTrailer] = useState<boolean>(true);
  const [thumbnails, setThumbnails] = useState<Youtube[]>([]);
  const api = "AIzaSyD18uVRSrbsFPx6EA8n80GZDt3_srgYu8A";
  useEffect(() => {
    const fetchThumbnails = async () => {
      if (movieTrailer?.results) {
        const keys = movieTrailer.results.map((item: any) => item.key);
        const promises = keys.map((key: string) =>
          fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${key}&key=${api}`
          ).then((response) => response.json())
        );

        try {
          const responses = await Promise.all(promises);
          const thumbnailsData = responses.map((response: any) => ({
            thumbnailUrl: response.items[0].snippet.thumbnails.medium.url,
            channelName: response.items[0].snippet.channelTitle,
            duration: response.items[0].contentDetails.duration,
          }));
          setThumbnails(thumbnailsData);
        } catch (error) {
          console.error("Error fetching thumbnails:", error);
        }
      }
    };

    fetchThumbnails();
  }, [movieTrailer]);

  if (isLoading) {
    return <SearchLoading />;
  }

  return (
    <>
      {movieTrailer?.results?.filter((type: any) => type?.type === "Bloopers")
        ?.length === 0 ? (
        <p className="relative float-left w-full md:w-[75%] text-center md:text-start -px-3 py-3 my-10">
          There no Bloopers for {movie?.title || movie?.name} yet!
        </p>
      ) : (
        <div className="flex flex-col relative float-left w-full md:w-[75%] -px-3 py-3 my-10">
          {movieTrailer?.results
            ?.filter((type: any) => type?.type === "Bloopers")
            ?.map((item: any, index: number) => {
              const thumbnailData = thumbnails[index];
              return (
                <div
                  className="flex items-start border-[1px] border-[#e3e3e3] rounded-md mb-5"
                  key={index}
                >
                  <div
                    className="flex w-[550px] h-[197px] bg-cover rounded-l-md"
                    style={{
                      backgroundImage: `url(${thumbnailData?.thumbnailUrl})`,
                      position: "relative",
                      backgroundPosition: "center",
                      backgroundSize: "enter",
                    }}
                  >
                    <div
                      className={`fixed top-0 left-0 right-0 bottom-0 max-w-6xl m-auto w-[95%] h-[50%] lg:h-[80%] ${
                        openTrailer ? "z-0 hidden" : "z-50"
                      }`}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${item?.key}`}
                        className={`w-full h-full ${
                          openTrailer ? "hidden" : "block"
                        }`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <div
                        className={`bg-black w-full h-14 absolute -top-12 left-0 right-0 bottom-0 z-9 border-t-black rounded-t-md ${
                          openTrailer ? "hidden" : "block"
                        }`}
                      >
                        <div className="flex items-center justify-between p-4">
                          <h1 className="text-white">Official Trailer</h1>
                          <p
                            className="text-white cursor-pointer"
                            onClick={() => {
                              setOpenTrailer(!openTrailer);
                            }}
                          >
                            <IoMdCloseCircle size={25} />
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[40%] left-[40%] bg-black p-5 rounded-full opacity-50 cursor-pointer">
                      <CiPlay1
                        size={25}
                        className="text-white opacity-100 font-bold"
                        onClick={() => setOpenTrailer(!openTrailer)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-full h-[197px]">
                    <div className="w-full pl-4">
                      <h1 className="text-md font-bold pt-2 pb-1">
                        {item?.name}
                      </h1>
                      <h2 className="text-sm">
                        {item?.type} • {formatDuration(thumbnailData?.duration)}{" "}
                        • {formatDate(item?.published_at)}
                      </h2>
                      <p>
                        <span className="inline-block text-xs border-[1px] border-[#e3e3e3] rounded-md p-1">
                          {item?.iso_3166_1}
                        </span>
                      </p>
                    </div>
                    <div className="bg-[#e3e3e3] w-full mt-auto">
                      <p className="inline-flex items-center align-middle pl-4 py-2">
                        <FaYoutube />{" "}
                        <span className="text-sm pl-1">
                          {thumbnailData?.channelName}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default MovieBloopers;
