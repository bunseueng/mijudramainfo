import React from "react";

const DramaRegion = ({ item }: any) => {
  const movieType = item?.media_type === "movie";
  // Assuming genre_ids and origin_country are arrays
  const genreIds = item?.genre_ids || [];
  const originCountries = item?.origin_country && item?.origin_country[0];
  const dramaType = item?.media_type === "tv";
  // Check if genreIds include 10764 and originCountries include "CN"
  const isChineseDrama =
    dramaType &&
    originCountries?.includes("CN") &&
    !genreIds?.includes(10764) &&
    !genreIds?.includes(16);
  const isKoreanDrama =
    dramaType &&
    originCountries?.includes("KR") &&
    !genreIds?.includes(10764) &&
    !genreIds?.includes(16);
  const isJapanDrama =
    dramaType &&
    originCountries?.includes("JP") &&
    !genreIds?.includes(10764) &&
    !genreIds?.includes(16);
  const isHKDrama =
    dramaType &&
    originCountries?.includes("HK") &&
    !genreIds?.includes(10764) &&
    !genreIds?.includes(16);
  const isTaiwanDrama =
    dramaType &&
    originCountries?.includes("TW") &&
    !genreIds?.includes(10764) &&
    !genreIds?.includes(16);
  const isThaiDrama =
    dramaType &&
    originCountries?.includes("TH") &&
    !genreIds?.includes(10764) &&
    !genreIds?.includes(16);
  const isChineseMovie = movieType && originCountries?.includes("CN");
  const isKoreanMovie = movieType && originCountries?.includes("KR");
  const isJapanMovie = movieType && originCountries?.includes("JP");
  const isHKMovie = movieType && originCountries?.includes("HK");
  const isTaiwanMovie = movieType && originCountries?.includes("TW");
  const isThaiMovie = movieType && originCountries?.includes("TH");
  const isMovie =
    movieType && !genreIds?.includes(10764) && !genreIds?.includes(16);
  const isChineseShow =
    genreIds?.includes(10764) && originCountries?.includes("CN");
  const isKoreanShow =
    genreIds?.includes(10764) && originCountries?.includes("KR");
  const isJapanShow =
    genreIds?.includes(10764) && originCountries?.includes("JP");
  const ChineseDrama =
    genreIds?.includes(18) &&
    !genreIds?.includes(16) &&
    originCountries?.includes("CN");
  const KoreanDrama =
    genreIds?.includes(18) &&
    !genreIds?.includes(16) &&
    originCountries?.includes("KR");
  const JapanDrama =
    genreIds?.includes(18) &&
    !genreIds?.includes(16) &&
    originCountries?.includes("JP");
  const HKDrama =
    genreIds?.includes(18) &&
    !genreIds?.includes(16) &&
    originCountries?.includes("HK");
  const TwDrama =
    genreIds?.includes(18) &&
    !genreIds?.includes(16) &&
    originCountries?.includes("TW");
  const ThDrama =
    genreIds?.includes(18) &&
    !genreIds?.includes(16) &&
    originCountries?.includes("TH");
  return (
    <div>
      {isChineseShow && "Chinese Tv Show"}
      {isKoreanShow && "Korean Tv Show"}
      {isJapanShow && "Japanese Tv Show"}
      {isChineseDrama ? isChineseDrama : ChineseDrama && "Chinese Drama"}
      {isKoreanDrama ? isKoreanDrama : KoreanDrama && "Korean Drama"}
      {isJapanDrama ? isJapanDrama : JapanDrama && "Japanese Drama"}
      {isHKDrama ? isHKDrama : HKDrama && "Hongkong Drama"}
      {isTaiwanDrama ? isTaiwanDrama : TwDrama && "Taiwanese Drama"}
      {isThaiDrama ? isThaiDrama : ThDrama && "Thai Drama"}
      {isChineseMovie && "Chinese Movie"}
      {isKoreanMovie && "Korean Movie"}
      {isJapanMovie && "Japanese Movie"}
      {isHKMovie && "Hongkong Movie"}
      {isTaiwanMovie && "Taiwanese Movie"}
      {isThaiMovie && "Thai Movie"}
      {genreIds.includes(16) && "Anime"}
      {isMovie && "Movie"}
    </div>
  );
};

export default DramaRegion;
