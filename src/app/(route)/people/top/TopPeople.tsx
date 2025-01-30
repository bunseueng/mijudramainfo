"use client";

import {
  fetchPerson,
  fetchPersonLike,
  fetchTopPeople,
} from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import TopActorCard from "@/app/component/ui/Card/TopActorCard";
import type { currentUserProps } from "@/helper/type";
import { PersonDb } from "@/app/component/ui/Fetching/Person";
import { zodResolver } from "@hookform/resolvers/zod";
import { personLove, type TPersonLove } from "@/helper/zod";
import { useForm } from "react-hook-form";

interface ITopActor {
  currentUser: currentUserProps;
}

const TopPeople: React.FC<ITopActor> = ({ currentUser }) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number.parseInt(searchParams?.get("page") || "1");
  const title = "Top Actors";
  const { register, handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });

  const {
    data: topActor,
    isLoading: isTopActorLoading,
    error: topActorError,
  } = useQuery({
    queryKey: ["topPeople", currentPage],
    queryFn: () => fetchTopPeople(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = topActor?.total_results;
  const per_page = searchParams?.get("per_page") || 20;
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const items = topActor?.total_results;
  const totalItems = topActor?.results?.slice(start, end);
  const filteredActor = totalItems?.filter(
    (item: any) => item?.known_for_department === "Acting"
  );
  const actorIds = filteredActor?.map((actor: any) => actor?.id) || [];

  const queries = useQueries({
    queries: [
      {
        queryKey: ["person", actorIds],
        queryFn: () => fetchPerson(actorIds),
        staleTime: 3600000,
        enabled: !!actorIds.length,
      },
      {
        queryKey: ["person_like", actorIds],
        queryFn: () => fetchPersonLike(actorIds),
        staleTime: 3600000,
        enabled: !!actorIds.length,
      },
    ],
  });

  const [personQuery, personLikeQuery] = queries;

  const isLoading =
    isTopActorLoading || queries.some((query) => query.isLoading);
  const isError = topActorError || queries.some((query) => query.isError);

  if (isError) {
    return <div>Error loading data. Please try again.</div>;
  }

  // Only render when we have all the data
  if (
    isLoading ||
    !topActor ||
    !totalItems ||
    !personQuery.data ||
    !personLikeQuery.data
  ) {
    return <SearchLoading />;
  }

  return (
    <Suspense fallback={<SearchLoading />}>
      <TopActorCard
        title={title}
        total_results={total_results}
        currentUser={currentUser}
        router={router}
        items={items}
        register={register}
        handleSubmit={handleSubmit}
        person={personQuery.data}
        person_like={personLikeQuery.data}
        setPage={setPage}
      />
    </Suspense>
  );
};

export default TopPeople;
