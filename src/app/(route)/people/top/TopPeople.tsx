"use client";

import { fetchActor, fetchTopPeople } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import TopActorCard from "@/app/component/ui/Card/TopActorCard";
import { currentUserProps, ICurrentUser } from "@/helper/type";
import { PersonDb } from "@/app/component/ui/Fetching/Person";

interface ITopActor {
  currentUser: currentUserProps;
  personDB: PersonDb[];
}

const TopPeople: React.FC<ITopActor> = ({ currentUser, personDB }) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Top Actors";
  const { data: topActor } = useQuery({
    queryKey: ["topPeople", currentPage],
    queryFn: () => fetchTopPeople(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = topActor?.total_results;
  return (
    <Suspense fallback={<SearchLoading />}>
      <TopActorCard
        title={title}
        topActor={topActor}
        total_results={total_results}
        currentUser={currentUser}
        personDB={personDB}
      />
    </Suspense>
  );
};

export default TopPeople;
