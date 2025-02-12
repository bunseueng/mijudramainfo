"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/actions/formatDate";
import { fetchRatings, getImageUrl } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";

interface TVShowCardProps {
  id: number;
  name: string;
  title: string;
  poster_path: string;
  first_air_date: string;
  release_date: string;
  vote_average: number;
  type: string;
  vote_count: number;
}

export const WatchImage: React.FC<TVShowCardProps> = ({
  id,
  name,
  title,
  poster_path,
  first_air_date,
  release_date,
  vote_average,
  type,
  vote_count,
}) => {
  const displayTitle = name || title;
  const displayDate = formatDate(first_air_date || release_date);
  const { data: rating_db } = useQuery({
    queryKey: ["ratings", id],
    queryFn: () => fetchRatings([id.toString()]), // ✅ Pass id as a string array
  });
  const findRatingDB = rating_db?.filter(
    (p: any) => p.tvId || p.movieId === id
  );
  const averageRating = findRatingDB
    ? findRatingDB.reduce(
        (sum: number, rating: any) => sum + rating.rating,
        0
      ) / findRatingDB.length
    : 0;
  return (
    <Link href={`/${type}/${id}-${title || name}/watch`} className="group">
      <div className="relative overflow-hidden rounded-lg">
        <div className="aspect-[2/3] relative">
          <Image
            src={getImageUrl(poster_path, "w500")}
            alt={displayTitle}
            width={100}
            height={100}
            quality={100}
            priority
            className="w-full h-full md:w-[225px] md:h-[350px]  object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white font-semibold text-lg">{displayTitle}</h3>
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>{displayDate}</span>
            <span className="flex items-center">
              ⭐{" "}
              {vote_average && vote_average && averageRating
                ? (
                    (vote_average * vote_count +
                      averageRating * averageRating) /
                    (vote_count + averageRating)
                  ).toFixed(1) // Apply toFixed(1) to the entire expression
                : averageRating
                ? averageRating.toFixed(1)
                : vote_average && vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
