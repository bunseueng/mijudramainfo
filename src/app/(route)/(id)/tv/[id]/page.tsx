import { Suspense } from "react";
import DramaMain from "./DramaMain";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import TvList from "./TvList";
import { Metadata } from "next";
import { getYearFromDate } from "@/app/actions/getYearFromDate";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const tv_id = params.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
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

  return {
    title: `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})`,
    description: `All information of ${tvDetails?.name}`,
  };
}

export default async function tvPage({ params }: { params: { id: string } }) {
  const tv_id = params.id;
  const user = await getCurrentUser();
  const users = await prisma.user.findMany({});
  const watchlist = await prisma.watchlist.findMany({
    where: { userId: user?.id },
  });
  const lists = await prisma.dramaList.findMany({});

  const existedWatchlist = watchlist.find((item: any) =>
    item.movieId.some((movie: any) => movie.id === parseInt(tv_id))
  );

  const existedFavorite = watchlist.find((item: any) =>
    item.favoriteIds.some((movie: any) => movie.id === parseInt(tv_id))
  );

  const userRating = await prisma.rating.findMany({
    where: { userId: user?.id, tvId: tv_id },
  });

  const existingRatings = await prisma.rating.findMany({
    where: { tvId: tv_id },
  });

  const getComment = await prisma.comment.findMany({
    where: {
      postId: tv_id,
    },
  });

  const getReview = await prisma.tvReview.findMany({
    where: { tv_id: tv_id },
  });

  const getDrama = await prisma.drama.findUnique({ where: { tv_id: tv_id } });

  return (
    <>
      <TvList tv_id={tv_id} />
      <Suspense fallback={<SearchLoading />}>
        <DramaMain
          tv_id={tv_id}
          existedWatchlist={existedWatchlist}
          existedFavorite={existedFavorite}
          user={user}
          users={users}
          existingRatings={existingRatings}
          userRating={userRating}
          getComment={getComment}
          getDrama={getDrama}
          getReview={getReview}
          lists={lists}
        />
      </Suspense>
    </>
  );
}
