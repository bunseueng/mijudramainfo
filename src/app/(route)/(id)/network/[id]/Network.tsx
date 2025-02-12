"use client";

import type React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  fetchTvByNetwork,
  fetchTvNetworks,
  fetchTv,
  fetchRatings,
} from "@/app/actions/fetchMovieApi";
import { SearchPagination } from "@/app/component/ui/Pagination/SearchPagination";
import { NetworkHeader } from "./NetworkHeader";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { NetworkCard } from "./NetworkCard";
import { NetworkFilter } from "./NetworkFilter";

interface Network {
  network_id: string;
}

const Network: React.FC<Network> = ({ network_id }) => {
  const [sortby, setSortby] = useState<string>();
  const [genre, setGenre] = useState<string>("18");
  const [withoutGenre, setWithoutGenre] = useState<string>("16|10767|10764|35");
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = Number.parseInt(searchParams?.get("page") || "1");
  const per_page = Number.parseInt(searchParams?.get("per_page") || "20");

  const { data: networksDetail } = useQuery({
    queryKey: ["networksDetail", network_id],
    queryFn: () => fetchTvNetworks(network_id),
    staleTime: 3600000,
  });

  const { data: networks, isLoading: isNetworksLoading } = useQuery({
    queryKey: [
      "networks",
      currentPage,
      network_id,
      sortby,
      genre,
      withoutGenre,
    ],
    queryFn: () =>
      fetchTvByNetwork(currentPage, network_id, sortby, genre, withoutGenre),
  });

  const totalItems = networks?.results?.slice(0, per_page) || [];
  const tvIds = totalItems.map((item: any) => item.id.toString());

  const { data: tvDetails, isLoading: isTvDetailsLoading } = useQuery({
    queryKey: ["tvDetails", tvIds],
    queryFn: () => fetchTv(tvIds),
    staleTime: 3600000,
    enabled: !!tvIds.length,
  });

  const { data: ratings, isLoading: isRatingsLoading } = useQuery({
    queryKey: ["ratings", tvIds],
    queryFn: () => fetchRatings(tvIds),
    staleTime: 3600000,
    enabled: !!tvIds.length,
  });

  if (isNetworksLoading || isTvDetailsLoading || isRatingsLoading) {
    return <SearchLoading />;
  }

  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
      <NetworkHeader networksDetail={networksDetail} />
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[70%] px-1 md:px-3">
            <div className="flex items-center justify-between mb-5">
              <p>{networks?.total_results} results</p>
            </div>
            {totalItems?.map((drama: any, idx: number) => {
              const startCal = (currentPage - 1) * per_page;
              const overallIndex = startCal + idx + 1;
              const tvDetail = tvDetails?.find(
                (data: any) => data.id === drama.id
              );

              return (
                <NetworkCard
                  key={drama?.id}
                  drama={drama}
                  tvDetail={tvDetail}
                  ratings={ratings}
                  overallIndex={overallIndex}
                />
              );
            })}
          </div>

          <div className="w-full md:w-[30%] px-1 md:pl-3 md:pr-1 lg:px-3">
            <NetworkFilter
              genre={genre}
              setGenre={setGenre}
              setWithoutGenre={setWithoutGenre}
              sortby={sortby}
              setSortby={setSortby}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between px-1 md:px-2 mt-3">
        <SearchPagination
          setPage={setPage}
          totalItems={networks?.total_results}
          per_page={per_page.toString()}
        />
      </div>
    </div>
  );
};

export default Network;
