"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  fetchCastCredit,
  fetchContentRating,
  fetchImages,
  fetchKeyword,
  fetchLanguages,
  fetchRecommendation,
  fetchReview,
  fetchTitle,
  fetchTrailer,
  fetchTv,
  fetchVideos,
} from "@/app/actions/fetchMovieApi";
import { getTextColor } from "@/app/actions/getTextColor";
import dynamic from "next/dynamic";
import DramaCast from "./DramaCast";
import TvList from "./TvList";
import DramaInfo from "@/app/component/ui/Drama/DramaInfo";
import DramaHeader from "@/app/component/ui/Drama/DramaHeader";
import { useDramaData } from "@/hooks/useDramaData";
import { DramaDetails, DramaReleasedInfo } from "@/helper/type";
import { formatDate } from "@/app/actions/formatDate";

const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const DramaMain = ({
  getDrama,
  getReview,
  tv_id,
  existedWatchlist,
  existedFavorite,
  user,
  existingRatings,
  userRating,
  getComment,
  users,
  lists,
}: any) => {
  const router = useRouter();
  const [modal, setModal] = useState<boolean>(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [textColor, setTextColor] = useState("#FFFFFF");

  const {
    tv,
    isLoading,
    trailer,
    cast,
    language,
    content,
    keyword,
    title,
    review,
    image,
    video,
    recommend,
    allTvShows,
  } = useDramaData(tv_id);

  // Getting Crew
  const castCredit = cast?.crew?.map((item: any) => item);
  const director = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Directing"
  );
  const screenwriter = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Creator"
  );
  const original_country = tv?.origin_country?.[0];

  const matchedLanguage = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );
  const allTvShowsArray = Array.isArray(allTvShows) ? allTvShows : [];
  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === tv.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;
  const keywords = keyword?.results;
  const formattedKeywords = keywords?.map((key: any, index: number) => {
    const capitalizedKeyword =
      key.name.charAt(0).toUpperCase() + key.name.slice(1);
    return index === keywords?.length - 1
      ? capitalizedKeyword
      : capitalizedKeyword + ", ";
  });
  const formattedKeywordsDB = getDrama?.genres_tags[0]?.tag
    ?.map((key: any, index: number) => {
      const capitalizedKeyword =
        key.name.charAt(0).toUpperCase() + key.name.slice(1);
      return index === getDrama.genres_tags[0].tag.length - 1
        ? capitalizedKeyword
        : capitalizedKeyword + ", ";
    })
    .join("");
  const genres = tv?.genres;
  const tvRating = existingRatings?.map((item: any) => item?.rating);
  const sumRating = tvRating?.reduce(
    (acc: any, rating: number) => acc + rating,
    0
  );
  const calculatedRating = sumRating / existingRatings?.length;

  const [detail]: DramaDetails[] = (getDrama?.details ||
    []) as unknown as DramaDetails[];
  const [info]: DramaReleasedInfo[] = (getDrama?.released_information ||
    []) as unknown as DramaReleasedInfo[];

  const formattedFirstAirDate = tv?.first_air_date
    ? formatDate(tv.first_air_date)
    : "TBA";
  const formattedLastAirDate = tv?.last_air_date
    ? formatDate(tv.last_air_date)
    : "";
  const formattedFirstAirDateDB = info?.release_date
    ? formatDate(info.release_date)
    : "TBA";
  const formattedLastAirDateDB = info?.end_date
    ? formatDate(info.end_date)
    : "";

  const getColorFromImage = async (imageUrl: string) => {
    const response = await fetch("/api/extracting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data.error || "Failed to get color");
    }

    return data.averageColor;
  };

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const colorString = await getColorFromImage(
        getDrama?.cover ||
          `https://image.tmdb.org/t/p/${tv?.backdrop_path ? "w300" : "w92"}/${
            tv?.backdrop_path || tv?.poster_path
          }`
      );

      const regex = /rgb\((\d+), (\d+), (\d+)\)/;
      const match = colorString && colorString?.match(regex);

      if (match) {
        const [r, g, b] = match.slice(1).map(Number);
        const rgbaColor = `rgba(${r}, ${g}, ${b}, 1)`;
        const gradientBackground = `linear-gradient(to right, ${rgbaColor}, rgba(${r}, ${g}, ${b}, 0.84) 50%, rgba(${r}, ${g}, ${b}, 0.84) 100%)`;
        setDominantColor(gradientBackground);
        setTextColor(getTextColor(r, g, b));
      }
    }
  }, [tv?.backdrop_path, tv?.poster_path, getDrama]);

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current;
      imgElement.addEventListener("load", extractColor);
      return () => imgElement.removeEventListener("load", extractColor);
    }
  }, [tv, extractColor]);

  // API actions
  const onSubmit = async () => {
    try {
      const res = await fetch(`/api/tv/${tv?.id}/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tvId: tv?.id }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 404) {
        toast.error("Already in the watchlist.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onDelete = async () => {
    try {
      const res = await fetch(`/api/watchlist/${tv?.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: tv?.id }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onFavorite = async () => {
    try {
      const res = await fetch(`/api/favorite/${tv?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteIds: tv?.id }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onDeleteFavorite = async () => {
    try {
      const res = await fetch(`/api/favorite/${tv?.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteIds: tv?.id }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  if (isLoading) {
    return <SearchLoading />;
  }

  return (
    <section className="w-full relative z-50">
      <div className="w-full h-full">
        <TvList tv_id={tv_id} />

        <DramaHeader
          tv={tv}
          detail={detail}
          title={title}
          getDrama={getDrama}
          textColor={textColor}
          dominantColor={dominantColor}
          imgRef={imgRef as React.RefObject<HTMLImageElement>}
          extractColor={extractColor}
          existedWatchlist={existedWatchlist}
          existedFavorite={existedFavorite}
          onSubmit={onSubmit}
          onDelete={onDelete}
          onFavorite={onFavorite}
          onDeleteFavorite={onDeleteFavorite}
          trailer={trailer}
          modal={modal}
          setModal={setModal}
          userRating={userRating}
          user={user}
          calculatedRating={calculatedRating}
          existingRatings={existingRatings}
          director={director}
          screenwriter={screenwriter}
          formattedKeywordsDB={formattedKeywordsDB}
          formattedKeywords={formattedKeywords}
          info={info}
          matchedLanguage={matchedLanguage}
          content={content}
          rank={rank}
          formattedDates={{
            formattedFirstAirDate,
            formattedLastAirDate,
            formattedFirstAirDateDB,
            formattedLastAirDateDB,
          }}
        />

        <DramaCast
          getDrama={getDrama}
          cast={cast}
          tv={tv}
          content={content}
          language={language}
          allTvShows={allTvShows}
          review={review}
          tv_id={tv_id}
          image={image}
          video={video}
          recommend={recommend}
          user={user}
          users={users}
          getComment={getComment}
          getReview={getReview}
          lists={lists}
          keyword={keyword}
        />
      </div>
    </section>
  );
};

export default DramaMain;
