"use client";

import { Suspense } from "react";
import { GoHeart } from "react-icons/go";
import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { TPersonLove } from "@/helper/zod";
import Link from "next/link";
import LazyImage from "@/components/ui/lazyimage";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import Discuss from "@/app/(route)/(id)/tv/[id]-[slug]/discuss/Discuss";
import type {
  UserProps,
  PersonDBType,
  currentUserProps,
  CommentProps,
  TVShow,
} from "@/helper/type";
import PersonBiography from "@/app/component/ui/Person/PersonBiography";
import type { JsonValue } from "@prisma/client/runtime/library";

interface PersonContentProps {
  persons: any;
  currentUser: currentUserProps | null;
  getPersons: PersonDBType | null;
  drama: TVShow;
  movie: TVShow;
  users: UserProps[];
  getComment: CommentProps[];
  tv_id: number;
  register: UseFormRegister<{
    userId?: string | undefined;
    love?: number | undefined;
    loveBy?: string[] | undefined;
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      userId?: string | undefined;
      love?: number | undefined;
      loveBy?: string[] | undefined;
    },
    undefined
  >;
  isCurrentUserLoved: JsonValue | undefined;
  handleLove: (data: TPersonLove) => Promise<void>;
  personFullDetails: {
    results: Array<{
      known_for_department: string;
      known_for: Array<{
        title?: string | null;
        name?: string | null;
        media_type: string;
        id: number;
        poster_path: string | null;
        backdrop_path: string | null;
        first_air_date: string;
        release_date: string;
      }>;
    }>;
  };
}

const renderKnownFor = (
  personDetails: PersonContentProps["personFullDetails"]["results"][0]
) => {
  if (personDetails.known_for_department.toLowerCase() === "acting") {
    return null;
  }

  const sortedContent = personDetails.known_for?.sort((a: any, b: any) => {
    const dateA = a.first_air_date || a.release_date;
    const dateB = b.first_air_date || b.release_date;
    if (!dateA && dateB) return -1;
    if (dateA && !dateB) return 1;
    return 0;
  });

  if (sortedContent?.length === 0) {
    return (
      <div className="text-md font-semibold text-start">No data available.</div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-lg font-semibold mb-2">
        {personDetails.known_for_department}
      </p>
      <ul className="w-auto min-h-[221px] flex flex-nowrap justify-start overflow-hidden overflow-x overflow-y-hidden pb-2">
        {sortedContent.map((item, index) => {
          const type = item?.media_type === "tv" ? "/tv" : "/movie";
          return (
            <li
              className={`w-[130px] max-w-[195px] ${
                index === sortedContent?.length - 1 ? "mr-0" : "mr-2"
              }`}
              key={index}
            >
              <div className="w-[130px] h-auto bg-cover">
                <Link
                  prefetch={false}
                  aria-label={`Visit ${
                    type.charAt(0).toUpperCase() + type.slice(1)
                  } Page`}
                  href={`${type}/${item?.id}-${spaceToHyphen(
                    item?.title || (item?.name as string)
                  )}`}
                  className="block hover:relative transform duration-100 group"
                >
                  <LazyImage
                    src={
                      item?.poster_path || item?.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500/${
                            item?.poster_path || item?.backdrop_path
                          }`
                        : "/placeholder-image.avif"
                    }
                    alt={`${item?.name || item?.title}'s Poster`}
                    width={200}
                    height={250}
                    quality={100}
                    priority
                    className="w-[125px] h-[175px] object-cover rounded-md"
                    placeholder="blur"
                    blurDataURL={
                      item?.poster_path ||
                      item?.backdrop_path ||
                      "/placeholder-image.avif"
                    }
                  />
                </Link>
              </div>
              <div className="mt-2 space-y-1 inline-block break-words">
                <h3 className="text-xs font-medium break-words line-clamp-2 group-hover:text-primary">
                  {item?.name || item?.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item?.first_air_date || item?.release_date ? (
                    (item?.first_air_date || item?.release_date).split("-")[0]
                  ) : (
                    <span className="text-[#2490da]">Upcoming</span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default function PersonContent({
  persons,
  currentUser,
  getPersons,
  drama,
  movie,
  users,
  getComment,
  tv_id,
  register,
  handleSubmit,
  isCurrentUserLoved,
  handleLove,
  personFullDetails,
}: PersonContentProps) {
  const isActor = persons?.known_for_department.toLowerCase() === "acting";

  const renderContent = (data: any, type: "drama" | "movie" | "variety") => {
    let filteredContent;
    let linkPrefix;

    if (type === "drama") {
      filteredContent = data?.cast?.filter(
        (item: any) =>
          !item?.genre_ids.includes(10764) &&
          !item?.genre_ids.includes(16) &&
          item?.genre_ids.length !== 0 &&
          item?.character !== ""
      );
      linkPrefix = "/tv";
    } else if (type === "movie") {
      filteredContent = data?.cast?.filter(
        (item: any) =>
          !item?.genre_ids.includes(10764) &&
          !item?.genre_ids.includes(16) &&
          !item?.genre_ids.includes(10402) &&
          item?.genre_ids.length !== 0
      );
      linkPrefix = "/movie";
    } else {
      filteredContent = data?.cast?.filter((item: any) =>
        item?.genre_ids.includes(10764)
      );
      linkPrefix = "/tv";
    }

    const sortedContent = filteredContent?.sort((a: any, b: any) => {
      const dateA = a.first_air_date || a.release_date;
      const dateB = b.first_air_date || b.release_date;
      if (!dateA && dateB) return -1;
      if (dateA && !dateB) return 1;
      return 0;
    });

    if (sortedContent?.length === 0) {
      return (
        <div className="text-md font-semibold text-start">
          No data available.
        </div>
      );
    }

    return (
      <ul className="w-auto min-h-[221px] flex flex-nowrap justify-start overflow-hidden overflow-x overflow-y-hidden pb-2">
        {sortedContent?.map((item: any, index: number) => (
          <li
            className={`w-[130px] max-w-[195px] ${
              index === sortedContent?.length - 1 ? "mr-0" : "mr-2"
            }`}
            key={index}
          >
            <div className="w-[130px] h-auto bg-cover">
              <Link
                prefetch={false}
                aria-label={`Visit ${
                  type.charAt(0).toUpperCase() + type.slice(1)
                } Page`}
                href={`${linkPrefix}/${item?.id}-${spaceToHyphen(
                  item?.title || item?.name
                )}`}
                className="block hover:relative transform duration-100 group"
              >
                <LazyImage
                  src={
                    item?.poster_path || item?.backdrop_path
                      ? `https://image.tmdb.org/t/p/w500/${
                          item?.poster_path || item?.backdrop_path
                        }`
                      : "/placeholder-image.avif"
                  }
                  alt={`${item?.name || item?.title}'s Poster`}
                  width={200}
                  height={250}
                  quality={100}
                  priority
                  className="w-[125px] h-[175px] object-cover rounded-md"
                  placeholder="blur"
                  blurDataURL={
                    item?.poster_path ||
                    item?.backdrop_path ||
                    "/placeholder-image.avif"
                  }
                />
              </Link>
            </div>
            <div className="mt-2 space-y-1 inline-block break-words">
              <h3 className="text-xs font-medium break-words line-clamp-2 group-hover:text-primary">
                {item?.name || item?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {item?.first_air_date || item?.release_date ? (
                  (item?.first_air_date || item?.release_date).split("-")[0]
                ) : (
                  <span className="text-[#2490da]">Upcoming</span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-8">
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl text-[#2490da] font-bold">
            {persons?.displayName || persons?.name}
          </h1>
          <button
            {...register("love")}
            className="flex items-center space-x-2"
            name="Love icon"
            onClick={handleSubmit(handleLove)}
          >
            <GoHeart
              className={`text-2xl ${isCurrentUserLoved ? "text-red-600" : ""}`}
            />
            <span>{String(getPersons?.love || 0)}</span>
          </button>
        </div>
        <PersonBiography persons={persons} />
        {personFullDetails &&
          personFullDetails.results.map((personDetails, index) => (
            <div key={index}>{renderKnownFor(personDetails)}</div>
          ))}
      </div>

      {isActor && (
        <section className="space-y-8">
          {["Drama", "Movie", "Variety Show"].map((type) => (
            <div key={type}>
              <h2 className="text-xl font-bold mb-4">{type}</h2>
              <div className="relative top-0 left-0">
                {renderContent(
                  type.toLowerCase() === "variety show"
                    ? drama
                    : type.toLowerCase() === "movie"
                    ? movie
                    : drama,
                  type.toLowerCase() as "drama" | "movie" | "variety"
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      <section>
        <Suspense
          fallback={<div className="animate-pulse">Loading comments...</div>}
        >
          <Discuss
            user={currentUser as UserProps | any}
            users={users}
            getComment={getComment}
            tv_id={tv_id.toString()}
            type="person"
          />
        </Suspense>
      </section>
    </div>
  );
}
