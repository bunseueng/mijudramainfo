"use client";

import MovieCast from "./MovieCast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getTextColor } from "@/app/actions/getTextColor";
import Image from "next/image";
import { formatDate } from "@/app/actions/formatDate";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CommentProps,
  DramaDetails,
  DramaReleasedInfo,
  IExistedFavorite,
  IMovieReview,
  List,
  MovieDB,
  Rating,
  TrailerVideo,
  UserProps,
} from "@/helper/type";
import MovieList from "./MovieList";
import MovieHeader from "@/app/component/ui/Movie/MovieHeader";
import MovieRating from "@/app/component/ui/Movie/MovieRating";
import MovieActions from "@/app/component/ui/Movie/MovieActions";
import MovieDetails from "@/app/component/ui/Movie/MovieDetails";
import { useMovieData } from "@/hooks/useMovieData";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import WatchNowButton from "@/app/component/ui/Button/WatchNowButton";

type MovieMainProps = {
  movie_id: string;
  getMovie: MovieDB | null;
  user: UserProps | any;
  users: UserProps[];
  getComment: CommentProps[];
  lists: List[];
  existedFavorite: IExistedFavorite | undefined;
  existedWatchlist: IExistedFavorite | undefined;
  existingRatings: Rating[];
  getReview: IMovieReview[] | any;
  userRating: Rating[];
};

const MovieMain = ({
  movie_id,
  getMovie,
  user,
  users,
  getComment,
  lists,
  existedFavorite,
  existedWatchlist,
  existingRatings,
  getReview,
  userRating,
}: MovieMainProps) => {
  const [openList, setOpenList] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [certification, setCertification] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const [textColor, setTextColor] = useState("#FFFFFF"); // Default to white text
  const router = useRouter();
  const getColorFromImage = useColorFromImage();
  const { movie, isLoading } = useMovieData(movie_id);
  const cast = movie?.credits || {};
  const keyword = movie?.keywords || {};
  const title = movie?.alternative_titles?.titles || [];
  const review = movie?.reviews?.results || [];
  const image = movie?.images || {};
  const video = movie?.videos?.results || ([] as TrailerVideo[]);
  const recommend = movie?.recommendations?.results || [];
  const allmovieShows = movie?.similar?.results || [];
  // Getting Crew
  const castCredit = cast?.crew?.map((item: any) => item);
  const director = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Directing"
  );
  const screenwriter = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Creator"
  );
  const keywords = keyword?.keywords;
  const allTvShowsArray = Array.isArray(allmovieShows) ? allmovieShows : [];
  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === movie.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;
  const formattedKeywords = keywords?.map((key: any, index: number) => {
    const capitalizedKeyword =
      key.name.charAt(0).toUpperCase() + key.name.slice(1);
    return index === keywords?.length - 1
      ? capitalizedKeyword
      : capitalizedKeyword + ", ";
  });
  const formattedKeywordsDB = getMovie?.genres_tags[0]?.tag
    ?.map((key: any, index: number) => {
      const capitalizedKeyword =
        key.name.charAt(0).toUpperCase() + key.name.slice(1);
      return index === getMovie?.genres_tags[0]?.tag.length - 1
        ? capitalizedKeyword
        : capitalizedKeyword + ", ";
    })
    .join("");

  const genres = movie?.genres;
  const movieRating = existingRatings?.map((item: any) => item?.rating);
  const sumRating = movieRating?.reduce(
    (acc: any, rating: number) => acc + rating,
    0
  );
  const calculatedRating = sumRating / existingRatings?.length;
  const [detail]: DramaDetails[] = (getMovie?.details ||
    []) as unknown as DramaDetails[];
  const [info]: DramaReleasedInfo[] = (getMovie?.released_information ||
    []) as unknown as DramaReleasedInfo[];
  const formattedLastAirDate = movie?.last_air_date
    ? formatDate(movie.last_air_date)
    : "";
  const formattedFirstAirDateDB = info?.release_date
    ? formatDate(info.release_date)
    : "TBA";
  const formattedLastAirDateDB = info?.end_date
    ? formatDate(info.end_date)
    : "";
  const onSubmit = async () => {
    try {
      const res = await fetch(`/api/movie/${movie?.id}/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: movie?.id,
        }),
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
      const res = await fetch(`/api/movie/${movie?.id}/watchlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: movie?.id,
        }),
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
      const res = await fetch(`/api/favorite/${movie?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: movie?.id,
        }),
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
      const res = await fetch(`/api/favorite/${movie?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: movie?.id,
        }),
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

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const imageUrl =
        (getMovie?.cover as string) ||
        `https://image.tmdb.org/t/p/${movie?.backdrop_path ? "w300" : "w92"}/${
          movie?.backdrop_path || movie?.poster_path
        }`;
      const [r, g, b] = await getColorFromImage(imageUrl);
      const rgbaColor = `rgba(${r}, ${g}, ${b}, 1)`; // Full opacity
      const gradientBackground = `linear-gradient(to right, ${rgbaColor}, rgba(${r}, ${g}, ${b}, 0.84) 50%, rgba(${r}, ${g}, ${b}, 0.84) 100%)`;
      setDominantColor(gradientBackground);
      const textColor = getTextColor(r, g, b);
      setTextColor(textColor);
    } else {
      console.error("Image url undefined");
    }
  }, [
    getMovie?.cover,
    movie?.backdrop_path,
    movie?.poster_path,
    getColorFromImage,
  ]);

  // Function to get user country based on IP
  const getUserCountry = async () => {
    try {
      const res = await fetch("https://ipinfo.io/json?token=80e3bb75bb316a", {
        method: "GET",
      });
      const data = await res.json();
      return data.country; // e.g., "US"
    } catch (error) {
      console.error("Error fetching user location:", error);
      return null;
    }
  };

  const getCertificationByCountry = useCallback(
    async (countryCode: string) => {
      if (!movie?.releases?.countries) {
        return "N/A";
      }
      // Normalize to uppercase to avoid case sensitivity issues
      const certificationData = movie?.releases?.countries?.find(
        (release: any) =>
          release.iso_3166_1.toUpperCase() === countryCode.toUpperCase()
      );
      return certificationData?.certification || "N/A"; // Default to "N/A" if not found
    },
    [movie?.releases?.countries]
  );

  useEffect(() => {
    const fetchCountryAndCertification = async () => {
      const country = await getUserCountry();

      if (country) {
        const cert = await getCertificationByCountry(country);
        setCertification(cert);
      } else {
        // Fallback to US certification if no country found
        const cert = await getCertificationByCountry("US");
        setCertification(cert);
      }
    };

    // Ensure movie data is available before calling the function
    if (movie?.releases?.countries) {
      fetchCountryAndCertification();
    }
  }, [movie, getCertificationByCountry]);

  // Ensure the image element is referenced correctly
  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [movie, extractColor]);

  if (isLoading) {
    return <SearchLoading />;
  }
  return (
    <section className="relative w-full z-50">
      <div className="w-full h-full">
        <MovieList movie_id={movie_id} movie={movie} />
        <div
          className="relative overflow-hidden bg-cover bg-no-repeat h-auto"
          style={{
            backgroundPosition: "calc(50vw - 510px) top",
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${
              movie?.backdrop_path || movie?.poster_path
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
                <div className="w-auto h-full">
                  <Image
                    ref={imgRef}
                    onLoad={extractColor}
                    src={
                      movie?.poster_path === null
                        ? "/placeholder-image.avif"
                        : getMovie?.cover ||
                          `https://image.tmdb.org/t/p/${
                            movie?.poster_path ? "w500" : "w780"
                          }/${movie?.poster_path || movie?.backdrop_path}`
                    }
                    alt={`${movie?.title}'s Poster` || "Movie Poster"}
                    width={300}
                    height={440}
                    quality={100}
                    priority
                    className="block align-middle !w-[300px] md:!min-w-[300px] !h-[440px] bg-cover object-cover rounded-lg md:pl-0"
                  />
                  <div className="!w-[300px] md:!min-w-[300px] my-3">
                    <WatchNowButton link={`/movie/${movie?.id}/watch`} />
                  </div>
                </div>
                <div className="md:pl-4 lg:pl-8 py-5">
                  <MovieHeader
                    title={detail?.title || movie?.title}
                    releaseDate={
                      info?.release_date ||
                      movie?.first_air_date ||
                      movie?.release_date
                    }
                    genres={movie?.genres}
                    textColor={textColor}
                  />

                  <MovieRating
                    movie={movie}
                    calculatedRating={calculatedRating}
                    existingRatings={existingRatings}
                    userRating={userRating}
                    modal={modal}
                    setModal={setModal}
                    textColor={textColor}
                    user={user}
                    movie_id={movie_id}
                  />

                  <MovieActions
                    openList={openList}
                    setOpenList={setOpenList}
                    existedFavorite={existedFavorite}
                    existedWatchlist={existedWatchlist}
                    onFavorite={onFavorite}
                    onDeleteFavorite={onDeleteFavorite}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                    video={video}
                    movieTitle={movie?.title || movie?.name}
                  />

                  <MovieDetails
                    getMovie={getMovie}
                    movie={movie}
                    detail={detail}
                    textColor={textColor}
                    director={director}
                    screenwriter={screenwriter}
                    genres={genres}
                    title={title}
                    formattedKeywords={formattedKeywords}
                    formattedKeywordsDB={formattedKeywordsDB}
                    formattedLastAirDate={formattedLastAirDate}
                    formattedFirstAirDateDB={formattedFirstAirDateDB}
                    formattedLastAirDateDB={formattedLastAirDateDB}
                    rank={rank}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <MovieCast
          cast={cast}
          movie={movie}
          allmovieShows={allmovieShows}
          review={review}
          movie_id={movie_id}
          image={image}
          video={video}
          recommend={recommend}
          user={user}
          users={users}
          getComment={getComment}
          getMovie={getMovie}
          getReview={getReview}
          lists={lists}
          keyword={keyword}
          certification={certification}
        />
      </div>
    </section>
  );
};

export default MovieMain;
