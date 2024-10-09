"use client";

import { Crown, Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { PersonDBType } from "@/helper/type";
import TopActorSkeleton from "../Loading/TopActorLoading";

type TopActorType = {
  personDB: PersonDBType[] | any;
  heading: string;
};

export default function TopActor({ heading, personDB }: TopActorType) {
  const person_ids = personDB.map((person: any) => person.personId); // Extract all personIds
  const fetchAllPersons = async () => {
    const allPersons = await Promise.all(
      person_ids.map((id: any) => fetchPerson(id)) // Fetch all persons' data
    );
    return allPersons;
  };

  const { data: persons, isLoading } = useQuery({
    queryKey: ["persons", person_ids], // Use person_ids to ensure query is unique
    queryFn: fetchAllPersons, // Fetch data for all personIds
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const filteredPerson = personDB?.filter((db: any) =>
    persons?.find((p) => db?.personId?.includes(p?.id))
  );

  const sortedUsers = filteredPerson?.sort((a: any, b: any) => {
    const totalA = a.totalPopularity;
    const totalB = b.totalPopularity;
    return totalB - totalA; // Sort descending by starCount
  });

  const getPersonData = persons?.filter((data) =>
    sortedUsers?.find((p: any) => p?.popularity[0]?.actorName === data?.name)
  );

  if (isLoading) {
    return <TopActorSkeleton />;
  }
  return (
    <Card className="w-full !bg-transparent !border-0 !rounded-none px-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{heading}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 2nd Place */}
          <Card className="w-full md:w-1/3 bg-gradient-to-b from-gray-100 to-gray-200">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block">
                <Medal className="w-8 h-8 text-gray-400 absolute -top-4 left-1/2 transform -translate-x-1/2" />
                <Image
                  src={`https://image.tmdb.org/t/p/w185/${getPersonData?.[1]?.profile_path}`}
                  alt={getPersonData?.[1]?.name}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                />
              </div>
              <h3 className="text-black font-semibold text-xl">
                {getPersonData?.[1]?.name}
              </h3>
              <p className="text-sm text-gray-600">
                {getPersonData?.[1]?.place_of_birth}
              </p>
              <div className="inline-flex">
                <Image src="/gift.svg" alt="gift" width={40} height={40} />{" "}
                <span className="text-black font-bold mt-2">
                  {sortedUsers?.[1]?.totalPopularity}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 1st Place */}
          <Card className="w-full md:w-1/3 bg-gradient-to-b from-yellow-100 to-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block">
                <Crown className="w-10 h-10 text-yellow-500 absolute -top-5 left-1/2 transform -translate-x-1/2" />
                <Image
                  src={`https://image.tmdb.org/t/p/w185/${getPersonData?.[0]?.profile_path}`}
                  alt={getPersonData?.[0]?.name}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                />
              </div>
              <h3 className="text-black font-semibold text-xl">
                {getPersonData?.[0]?.name}
              </h3>
              <p className="text-sm text-gray-600">
                {getPersonData?.[0]?.place_of_birth}
              </p>
              <div className="inline-flex">
                <Image src="/gift.svg" alt="gift" width={40} height={40} />{" "}
                <span className="text-black font-bold mt-2">
                  {sortedUsers?.[0]?.totalPopularity}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 3rd Place */}
          <Card className="w-full md:w-1/3 bg-gradient-to-b from-orange-100 to-orange-200">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block">
                <Medal className="w-8 h-8 text-orange-400 absolute -top-4 left-1/2 transform -translate-x-1/2" />
                <Image
                  src={
                    `https://image.tmdb.org/t/p/w185/${getPersonData?.[2]?.profile_path}` ||
                    "/placeholder-image.avf"
                  }
                  alt={getPersonData?.[2]?.name}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                />
              </div>
              <h3 className="text-black font-semibold text-xl">
                {getPersonData?.[2]?.name}
              </h3>
              <p className="text-sm text-gray-600">
                {getPersonData?.[2]?.place_of_birth}
              </p>
              <div className="inline-flex">
                <Image src="/gift.svg" alt="gift" width={40} height={40} />{" "}
                <span className="text-black font-bold mt-2">
                  {sortedUsers?.[2]?.totalPopularity}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 bg-primary/10 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              Who&apos;s the most loved Actor on MDI?
            </h4>
            <span className="bg-yellow-400 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Wanted
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
