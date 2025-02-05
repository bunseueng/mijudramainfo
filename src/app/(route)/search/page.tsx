import { Suspense } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
import { Metadata } from "next";
const SearchQuery = dynamic(
  () => import("../../component/ui/Search/SearchQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export async function generateMetadata(props: any): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/search`;
  return {
    title: "Search",
    alternates: {
      canonical: url,
    },
  };
}

const SearchPage = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/multi";
  const currentUser = await getCurrentUser();
  const getMovie = await prisma.movie.findMany();
  const getDrama = await prisma.drama.findMany();
  const getPerson = await prisma.person.findMany();
  return (
    <div>
      <Suspense fallback={<SearchLoading />}>
        <SearchQuery
          BASE_URL={BASE_URL}
          currentUser={currentUser}
          getMovie={getMovie}
          getDrama={getDrama}
          getPerson={getPerson}
        />
      </Suspense>
    </div>
  );
};

export default SearchPage;
