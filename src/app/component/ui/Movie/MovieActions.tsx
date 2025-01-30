import React from "react";
import {
  MdBookmarkAdd,
  MdFormatListBulletedAdd,
  MdOutlineFavorite,
} from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { IExistedFavorite, TrailerVideo } from "@/helper/type";
import PlayMovieTrailer from "@/app/(route)/(id)/movie/[id]-[slug]/PlayMovieTrailer";

interface MovieActionsProps {
  openList: boolean;
  setOpenList: (value: boolean) => void;
  existedFavorite: IExistedFavorite | undefined;
  existedWatchlist: IExistedFavorite | undefined;
  onFavorite: () => void;
  onDeleteFavorite: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  video: TrailerVideo[] | [];
  movieTitle: string;
}

const MovieActions = ({
  openList,
  setOpenList,
  existedFavorite,
  existedWatchlist,
  onFavorite,
  onDeleteFavorite,
  onSubmit,
  onDelete,
  movieTitle,
  video,
}: MovieActionsProps) => {
  return (
    <div className="flex items-center mt-2 mb-8">
      <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
        <MdFormatListBulletedAdd
          size={20}
          className="text-white cursor-pointer"
          onClick={() => setOpenList(!openList)}
        />
        {openList ? (
          <div className={`${openList && "tooltiptext"}`}>
            <div className="flex flex-col items-center">
              <Link
                prefetch={false}
                href="/lists/create"
                className="flex items-center justify-center py-1"
              >
                <IoIosAddCircle size={25} className="text-white" />
                <span className="pl-3">Create New List</span>
              </Link>
              <span className="pl-3 oveflow-hidden">
                Add {movieTitle} to one of your list
              </span>
            </div>
          </div>
        ) : (
          <span className="tooltiptext">Add to list</span>
        )}
      </div>

      {existedFavorite ? (
        <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
          <MdOutlineFavorite
            size={20}
            className="text-pink-500 cursor-pointer"
            onClick={onDeleteFavorite}
          />
          <span className="tooltiptext">Mark as favorite</span>
        </div>
      ) : (
        <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
          <MdOutlineFavorite
            size={20}
            className="text-slate-200 cursor-pointer"
            onClick={onFavorite}
          />
          <span className="tooltiptext">Mark as favorite</span>
        </div>
      )}

      {existedWatchlist ? (
        <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
          <MdBookmarkAdd
            size={20}
            className="text-red-500 cursor-pointer"
            onClick={onDelete}
          />
          <span className="tooltiptext">Remove from your watchlist</span>
        </div>
      ) : (
        <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
          <MdBookmarkAdd
            size={20}
            className="text-white cursor-pointer"
            onClick={onSubmit}
          />
          <span className="tooltiptext">Add to your watchlist</span>
        </div>
      )}

      <PlayMovieTrailer video={video as TrailerVideo[] | []} />
    </div>
  );
};

export default MovieActions;
