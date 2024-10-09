import { Suspense } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
const SearchQuery = dynamic(
  () => import("../../component/ui/Search/SearchQuery"),
  { ssr: false }
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

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
