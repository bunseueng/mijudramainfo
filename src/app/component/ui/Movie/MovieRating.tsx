import React, { Dispatch, SetStateAction } from "react";
import CircleRating from "@/app/component/ui/CircleRating/CircleRating";
import RatingModal from "@/app/component/ui/CircleRating/RatingModal";
import { IExistedFavorite, Rating, TMDBMovie, UserProps } from "@/helper/type";

interface MovieRatingProps {
  movie: TMDBMovie;
  calculatedRating: number;
  existingRatings: IExistedFavorite[] | any;
  userRating: Rating[];
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  textColor: string;
  user: UserProps;
  movie_id: string;
}

const MovieRating = ({
  movie,
  calculatedRating,
  existingRatings,
  userRating,
  modal,
  setModal,
  textColor,
  user,
  movie_id,
}: MovieRatingProps) => {
  const rating =
    movie && movie.vote_average && calculatedRating
      ? (
          (movie.vote_average * movie.vote_count +
            calculatedRating * calculatedRating) /
          (movie.vote_count + calculatedRating)
        ).toFixed(1)
      : calculatedRating
        ? calculatedRating.toFixed(1)
        : movie && movie.vote_average
          ? movie.vote_average.toFixed(1)
          : "NR";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-5">
      <CircleRating rating={rating} />
      <p
        className="inline-block text-1xl md:text-md lg:text-1xl font-bold uppercase my-3 md:pl-2 lg:pl-5"
        style={{ color: textColor, width: "auto", overflow: "hidden" }}
      >
        From {movie?.vote_count + existingRatings?.length}
        {movie?.vote_count < 2 ? " user" : " users"}
      </p>

      {userRating.length > 0 ? (
        <div
          className="group flex items-center justify-center space-2 rating_true reactions_true bg-[#032541] rounded-full cursor-pointer hover:scale-105 transition ease-in-out duration-150 pr-1 pl-4 py-1 md:ml-3"
          onClick={() => setModal(!modal)}
        >
          <div className="flex items-center text-white font-bold">
            <div className="flex items-center font-bold">Your vibe </div>
            <div className="flex items-center font-bold ml-2">
              <span className="text-[#21D07A] text-xl">
                {userRating[0]?.rating * 10}
                <span className="self-start text-xs pt-1">%</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="group flex items-center justify-center space-2 rating_true reactions_true bg-[#032541] rounded-full cursor-pointer hover:scale-105 transition ease-in-out duration-150 pr-4 pl-4 py-[9px] md:ml-3"
          onClick={() => setModal(!modal)}
        >
          <div className="flex items-center text-white font-bold text-xs lg:text-md">
            What&apos;s your{" "}
            <span className="border-b-[1px] border-b-cyan-500 ml-2 md:ml-0 lg:ml-2 pt-1">
              Vibe
            </span>
            ?
          </div>
        </div>
      )}

      {modal && (
        <RatingModal
          modal={modal}
          setModal={setModal}
          id={movie_id}
          user={user}
          userRating={userRating}
          tv={movie as TMDBMovie | any}
          tvName={""}
          tvItems={undefined}
        />
      )}
    </div>
  );
};

export default MovieRating;
