import type React from "react";

interface MediaItem {
  media_type?: string;
  genre_ids?: number[];
  origin_country?: string[];
}

const DramaRegion: React.FC<{ item: MediaItem }> = ({ item }) => {
  const { media_type, genre_ids = [], origin_country = [] } = item;

  const isMovie = media_type === "movie";
  const isVarietyShow = genre_ids.includes(10764);
  const isAnime = genre_ids.includes(16);
  const isDrama = genre_ids.includes(18) && !isAnime;

  const getCountrySpecificLabel = (country: string, mediaType: string) => {
    const countryMap: { [key: string]: string } = {
      CN: "Chinese",
      KR: "Korean",
      JP: "Japanese",
      HK: "Hongkong",
      TW: "Taiwanese",
      TH: "Thai",
    };
    return `${countryMap[country] || ""} ${mediaType}`;
  };

  const renderMediaType = () => {
    const country = origin_country[0];

    if (isAnime) return "Anime";
    if (isVarietyShow) return `${getCountrySpecificLabel(country, "Tv Show")}`;
    if (isDrama) return `${getCountrySpecificLabel(country, "Drama")}`;
    if (isMovie)
      return country ? `${getCountrySpecificLabel(country, "Movie")}` : "Movie";

    return null;
  };

  return <div>{renderMediaType()}</div>;
};

export default DramaRegion;
