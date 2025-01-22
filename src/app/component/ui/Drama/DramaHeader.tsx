import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import CircleRating from "@/app/component/ui/CircleRating/CircleRating";
import ActionButtons from "./ActionButtons";
import RatingModal from "@/app/component/ui/CircleRating/RatingModal";
import RatingButton from "./RatingButton";
import DramaInfo from "./DramaInfo";
import {
  CrewRole,
  DramaDB,
  DramaDetails,
  ITmdbDrama,
  Rating,
  TitleData,
  TrailerResponse,
  UserProps,
} from "@/helper/type";
import { MobileInfo } from "./MobileInfo";

interface DramaHeaderProps {
  tv: ITmdbDrama;
  detail: DramaDetails;
  title: TitleData;
  getDrama: DramaDB;
  textColor: string;
  dominantColor: string | null;
  imgRef: React.RefObject<HTMLImageElement>;
  extractColor: () => void;
  existedWatchlist: boolean;
  existedFavorite: boolean;
  onSubmit: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onDeleteFavorite: () => void;
  trailer: TrailerResponse;
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  userRating: Rating[];
  user: UserProps;
  calculatedRating: number;
  existingRatings: Rating[];
  director: CrewRole;
  screenwriter: any;
  formattedKeywordsDB: string;
  formattedKeywords: string[];
  info: any;
  matchedLanguage: any;
  formattedDates: any;
  content: any;
  rank: any;
}

const DramaHeader: React.FC<DramaHeaderProps> = ({
  tv,
  detail,
  title,
  getDrama,
  textColor,
  dominantColor,
  imgRef,
  extractColor,
  existedWatchlist,
  existedFavorite,
  onSubmit,
  onDelete,
  onFavorite,
  onDeleteFavorite,
  trailer,
  modal,
  setModal,
  userRating,
  user,
  calculatedRating,
  existingRatings,
  director,
  screenwriter,
  formattedKeywordsDB,
  formattedKeywords,
  info,
  matchedLanguage,
  formattedDates,
  content,
  rank,
}) => {
  return (
    <div
      className="relative overflow-hidden bg-cover bg-no-repeat h-auto"
      style={{
        backgroundPosition: "calc(50vw - 510px) top",
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${
          tv?.backdrop_path || tv?.poster_path
        })`,
      }}
    >
      <div
        className="w-full flex flex-wrap items-center justify-center h-full"
        style={{
          backgroundImage:
            dominantColor ||
            "linear-gradient(to right, rgba(24, 40, 72, 1) calc((50vw - 170px) - 340px), rgba(24, 40, 72, 0.84) 50%, rgba(24, 40, 72, 0.84) 100%)",
        }}
      >
        <div className="px-3">
          <div className="flex flex-col md:flex-row content-center max-w-6xl mx-auto md:py-8 md:px-2 lg:px-5 mt-5">
            <Image
              ref={imgRef}
              onLoad={extractColor}
              src={
                getDrama?.cover ||
                `https://image.tmdb.org/t/p/w780/${
                  tv?.poster_path || tv?.backdrop_path
                }`
              }
              alt={detail?.title || tv?.name}
              width={300}
              height={440}
              quality={100}
              priority
              className="block align-middle !w-[300px] md:!min-w-[300px] !h-[440px] bg-cover object-cover rounded-lg md:pl-0"
            />

            <div className="md:pl-4 lg:pl-8 py-5">
              <div className="relative">
                <h2
                  className="text-3xl font-bold text-white"
                  style={{ color: textColor }}
                >
                  <span className="cursor-pointer hover:opacity-50 duration-300">
                    {detail?.title || tv?.title || tv?.name}
                  </span>{" "}
                  ({getYearFromDate(tv?.first_air_date || tv?.release_date)})
                </h2>
              </div>
              <div className="mb-2 text-1xl font-bold text-white">
                <span
                  className="cursor-pointer hover:opacity-50 duration-300"
                  style={{ color: textColor }}
                >
                  {getDrama?.genres_tags?.length > 0
                    ? getDrama?.genres_tags
                        ?.map((tag: any) =>
                          tag?.genre?.map((gen: any) => gen?.value).join(", ")
                        )
                        .join(", ")
                    : tv?.genres?.length > 0
                    ? tv?.genres?.map((genre: any, index: number) => {
                        return index === tv.genres.length - 1
                          ? genre.name
                          : genre.name + ", ";
                      })
                    : null}
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center py-5">
                <CircleRating
                  rating={
                    tv && tv.vote_average && calculatedRating
                      ? (
                          (tv.vote_average * tv.vote_count +
                            calculatedRating * calculatedRating) /
                          (tv.vote_count + calculatedRating)
                        ).toFixed(1)
                      : calculatedRating
                      ? calculatedRating.toFixed(1)
                      : tv && tv.vote_average
                      ? tv.vote_average.toFixed(1)
                      : "NR"
                  }
                />

                <p
                  className="inline-block text-white text-1xl md:text-md lg:text-1xl font-bold uppercase my-3 md:pl-2 lg:pl-5"
                  style={{
                    color: textColor,
                    width: "auto",
                    overflow: "hidden",
                  }}
                >
                  From {tv?.vote_count + existingRatings?.length}
                  {tv?.vote_count < 2 ? " user" : " users"}
                </p>

                <RatingButton
                  userRating={userRating}
                  modal={modal}
                  setModal={setModal}
                />

                {modal && (
                  <RatingModal
                    modal={modal}
                    setModal={setModal}
                    id={tv?.id.toString()}
                    user={user}
                    userRating={userRating}
                    tv={tv}
                    tvName={""}
                    tvItems={undefined}
                  />
                )}
              </div>

              <ActionButtons
                existedWatchlist={existedWatchlist}
                existedFavorite={existedFavorite}
                onSubmit={onSubmit}
                onDelete={onDelete}
                onFavorite={onFavorite}
                onDeleteFavorite={onDeleteFavorite}
                trailer={trailer}
                textColor={textColor}
              />
              <DramaInfo
                detail={detail}
                title={title}
                tv={tv}
                textColor={textColor}
                getDrama={getDrama}
                director={director}
                screenwriter={screenwriter}
                formattedKeywordsDB={formattedKeywordsDB}
                formattedKeywords={formattedKeywords}
                info={info}
                matchedLanguage={matchedLanguage}
                formattedDates={formattedDates}
                content={content}
                rank={rank}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DramaHeader;
