import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import MovieMain from "./MovieMain";
import { Metadata } from "next";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
export const revalidate = 3600;

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const movie_id = params.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const tvDetails = await response.json();
  const original_country = tvDetails?.origin_country?.[0];
  const getLanguage = await fetch(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const language = await getLanguage.json();
  const matchedCountry = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );

  const countryToLanguageMap: { [key: string]: string } = {
    China: "Chinese",
    Korea: "Korean",
    Japan: "Japanese",
    Taiwan: "Taiwanese",
    Thai: "Thailand",
    // Add more mappings as needed
  };
  // Get the language name
  const languageName =
    countryToLanguageMap[matchedCountry?.english_name] ||
    matchedCountry?.english_name;

  if (!response) {
    throw new Error("Network response was not ok");
  }

  return {
    title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})`,
    description: `All information of ${tvDetails?.title}`,
    openGraph: {
      type: "website",
      url: "https://mijudramainfo.vercel.app/",
      title: tvDetails?.title,
      description: `All information of ${tvDetails?.title}`,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${tvDetails?.backdrop_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
export default async function tvPage({ params }: any) {
  const movie_id = params.id;
  const user = await getCurrentUser();
  const users = await prisma.user.findMany({});
  const getMovie = await prisma.movie.findUnique({
    where: { movie_id: movie_id },
  });
  const getComment = await prisma.comment.findMany({
    where: {
      postId: movie_id,
    },
  });
  const watchlist = await prisma.watchlist.findMany({
    where: { userId: user?.id },
  });
  const lists = await prisma.dramaList.findMany({});
  const existedWatchlist = watchlist.find((item: any) =>
    item.movieId.some((movie: any) => movie.id === parseInt(movie_id))
  );
  const existedFavorite = watchlist.find((item: any) =>
    item.favoriteIds.some((movie: any) => movie.id === parseInt(movie_id))
  );
  const userRating = await prisma.rating.findMany({
    where: { userId: user?.id, movieId: movie_id },
  });
  const existingRatings = await prisma.rating.findMany({
    where: { movieId: movie_id },
  });
  const getReview = await prisma.movieReview.findMany({
    where: { movie_id: movie_id },
  });

  return (
    <MovieMain
      movie_id={movie_id}
      user={user}
      users={users}
      getComment={getComment}
      getMovie={getMovie}
      lists={lists}
      existedFavorite={existedFavorite}
      existedWatchlist={existedWatchlist}
      existingRatings={existingRatings}
      getReview={getReview}
      userRating={userRating}
    />
  );
}
