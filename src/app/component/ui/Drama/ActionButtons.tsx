import React from "react";
import Link from "next/link";
import {
  MdBookmarkAdd,
  MdFormatListBulletedAdd,
  MdOutlineFavorite,
} from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import PlayTrailerBtn from "@/app/(route)/(id)/tv/[id]-[slug]/PlayTrailerBtn";

interface ActionButtonsProps {
  existedWatchlist: boolean;
  existedFavorite: boolean;
  onSubmit: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onDeleteFavorite: () => void;
  trailer: any;
  textColor: any;
  video: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  existedWatchlist,
  existedFavorite,
  onSubmit,
  onDelete,
  onFavorite,
  onDeleteFavorite,
  trailer,
  textColor,
  video,
}) => {
  const [openList, setOpenList] = React.useState(false);

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
            </div>
          </div>
        ) : (
          <span className="tooltiptext">Add to list</span>
        )}
      </div>

      <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
        <MdOutlineFavorite
          size={20}
          className={`cursor-pointer ${
            existedFavorite ? "text-pink-500" : "text-slate-200"
          }`}
          onClick={existedFavorite ? onDeleteFavorite : onFavorite}
        />
        <span className="tooltiptext">Mark as favorite</span>
      </div>

      <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
        <MdBookmarkAdd
          size={20}
          className={`cursor-pointer ${
            existedWatchlist ? "text-red-500" : "text-white"
          }`}
          onClick={existedWatchlist ? onDelete : onSubmit}
        />
        <span className="tooltiptext">
          {existedWatchlist
            ? "Remove from your watchlist"
            : "Add to your watchlist"}
        </span>
      </div>

      <PlayTrailerBtn trailer={trailer} textColor={textColor} video={video} />
    </div>
  );
};

export default ActionButtons;
