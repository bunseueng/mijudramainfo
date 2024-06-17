import React from "react";
import {
  convertToFiveStars,
  StyledRating,
} from "@/app/component/ui/Card/ExploreCard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Rating } from "@/app/helper/type";

const DramaListRating = ({ item }: any, yourRating: Rating[]) => {
  // Function to find rating for a specific item
  const findRating = (itemId: string) => {
    const rating =
      Array.isArray(yourRating) &&
      yourRating.find((rate) => rate.tvId === itemId);
    return rating ? rating.rating : null;
  };

  return (
    <span className="flex items-center text-sm">
      <StyledRating
        name="customized-color"
        value={convertToFiveStars(item?.id?.toString(), 10)}
        readOnly
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        precision={0.5}
        sx={{ fontSize: "20px" }}
      />
      <span className="pl-2">{findRating(item?.id?.toString())}</span>
    </span>
  );
};

export default DramaListRating;
