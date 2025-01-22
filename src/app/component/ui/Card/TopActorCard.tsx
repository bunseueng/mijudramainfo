"use client";

import { DramaPagination } from "@/app/component/ui/Pagination/DramaPagination";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import DramaFilter from "@/app/(route)/(drama)/drama/top/DramaFilter";
import SearchLoading from "../Loading/SearchLoading";
import AdBanner from "../Adsense/AdBanner";
import { useQueries } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { PersonDb } from "../Fetching/Person";
import { currentUserProps } from "@/helper/type";
import { personLove, TPersonLove } from "@/helper/zod";
import { toast } from "react-toastify";
import { GoHeart } from "react-icons/go";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

interface ITopActor {
  title: string;
  topActor: any;
  total_results: number;
  currentUser: currentUserProps;
  personDB: PersonDb[];
}

const TopActorCard: React.FC<ITopActor> = ({
  title,
  topActor,
  total_results,
  currentUser,
  personDB,
}) => {
  const [getPerson, setGetPerson] = useState<PersonDb>();
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const items = topActor?.total_results;
  const totalItems = topActor?.results?.slice(start, end);
  const filteredActor = totalItems?.filter(
    (item: any) => item?.known_for_department === "Acting"
  );
  const actorIds = filteredActor?.map((actor: string | any) => actor?.id) || [];
  const { register, handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });
  const queries = useQueries({
    queries: actorIds?.map((id: number) => ({
      queryKey: ["fetchPerson", id],
      queryFn: () => fetchPerson([id]), // Fetch persons for each ID
      enabled: !!id,
      staleTime: 3600000, // Cache data for 1 hour
      refetchOnWindowFocus: true, // Refetch when window is focused
    })),
  });

  // Extract data from queries
  const fetchPersonsData = queries?.map((query) => query.data).flat();
  const isLoading = queries?.some((query) => query.isLoading);
  const isError = queries?.some((query) => query.isError);

  const getBirth = (placeOfBirth: string) => {
    if (!placeOfBirth) return ""; // Handle cases where placeOfBirth is undefined or null
    const parts = placeOfBirth.split(","); // Split the string by comma
    return parts[parts.length - 1].trim(); // Get the last part and trim whitespace
  };

  useEffect(() => {
    const actorId =
      filteredActor?.map((actor: string | any) => actor?.id) || [];
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/person/${actorId}/love`, {
          method: "GET",
        });
        if (res.ok) {
          const data = await res.json();
          router.refresh();
          setGetPerson(data);
        } else {
          console.error("Failed to fetch person from API");
        }
      } catch (error) {
        console.error("Failed to fetch person from API:", error);
      }
    };
    fetchPerson();
  }, [filteredActor, router]);

  const handleLove = async (data: TPersonLove, actorId: number) => {
    try {
      const res = await fetch(`/api/person/${actorId}/love`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          love: data?.love,
          loveBy: data?.loveBy,
          ...data, // Include other data here
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        toast.error("Failed to love");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to love");
    }
  };

  if (isLoading) return <SearchLoading />;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="max-w-[1134px] mx-auto py-4">
      <div className="py-5">
        <AdBanner dataAdFormat="auto" dataAdSlot="8077904488" />
      </div>
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[70%] px-1 md:px-3">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p>{total_results} results</p>
            </div>
            {fetchPersonsData?.map((person: any) => {
              const personRecord = personDB.find(
                (db) => db?.personId === String(person?.id)
              );
              const isCurrentUserLoved = personRecord?.lovedBy.find((item) =>
                item.includes(currentUser?.id)
              );
              return (
                <div
                  className="flex border-2 bg-white dark:bg-[#242424] dark:border-[#272727] rounded-lg p-4 mb-10"
                  key={person?.id}
                >
                  <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
                    <div className="relative">
                      <Link
                        href={`/person/${person?.id}-${spaceToHyphen(
                          person?.name
                        )}`}
                      >
                        {person?.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/original/${person?.profile_path}`}
                            alt={person?.profile_path}
                            width={200}
                            height={200}
                            style={{ width: "100%", height: "100%" }}
                            priority
                            className="w-full object-cover align-middle overflow-clip"
                          />
                        ) : (
                          <Image
                            src="/empty-img.jpg"
                            alt={person?.profile_path}
                            width={200}
                            height={200}
                            style={{ width: "100%", height: "100%" }}
                            priority
                            className="w-full h-full align-middle overflow-clip"
                          />
                        )}
                      </Link>
                    </div>
                  </div>
                  <div className="pl-2 md:pl-3 w-[80%]">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/person/${person?.id}-${spaceToHyphen(
                          person?.name
                        )}`}
                        className="text-md text-sky-700 dark:text-[#2196f3] font-bold"
                      >
                        {person?.name || person?.title}
                      </Link>
                      <button
                        onClick={handleSubmit((data) =>
                          handleLove(data, person.id)
                        )}
                      >
                        {isCurrentUserLoved ? (
                          <span className="flex items-center text-red-600">
                            <GoHeart {...register("love")} />
                            <span className="pl-1">
                              {personRecord?.love || 0}
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <GoHeart {...register("love")} />
                            <span className="pl-1">
                              {personRecord?.love || 0}
                            </span>
                          </span>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#818a91] font-semibold line-clamp-3 truncate whitespace-normal">
                      {getBirth(person?.place_of_birth)}
                    </p>
                    <p className="text-sm font-semibold line-clamp-3 truncate whitespace-normal my-2">
                      {person?.biography === ""
                        ? `${person?.name} does not have biography yet!`
                        : person?.biography}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full md:w-[30%] px-1 md:pl-3 md:pr-1 lg:px-3">
            <div className="py-5 hidden md:block">
              <AdBanner dataAdFormat="auto" dataAdSlot="3527489220" />
            </div>
            <div className="border bg-white dark:bg-[#242424] rounded-lg">
              <h1 className="text-lg font-bold p-4 border-b-2 border-b-slate-400 dark:border-[#272727]">
                Advanced Search
              </h1>
              <Suspense fallback={<SearchLoading />}>
                <DramaFilter />
              </Suspense>
            </div>
            <div className="hidden md:block relative bg-black mx-auto my-5">
              <div className="min-w-auto min-h-screen">
                <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5">
        <Suspense fallback={<div>Loading...</div>}>
          <DramaPagination setPage={setPage} totalItems={items} />
        </Suspense>
      </div>
    </div>
  );
};

export default TopActorCard;
