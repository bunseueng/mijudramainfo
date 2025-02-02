"use client";

import { Trophy, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { PersonDBType } from "@/helper/type";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import Link from "next/link";
import Image from "next/image";

type TopActorType = {
  personDB: PersonDBType[] | any;
  heading: string;
};

export default function TopActor({ heading, personDB }: TopActorType) {
  const person_ids = personDB.map((person: PersonDBType) => person.personId);

  const { data: persons, isLoading } = useQuery({
    queryKey: ["persons", person_ids],
    queryFn: () => fetchPerson(person_ids),
    staleTime: 3600000,
    refetchOnWindowFocus: true,
  });

  const filteredPerson = personDB?.filter((db: PersonDBType) =>
    persons?.find((p: any) => db?.personId?.includes(p?.id))
  );

  const sortedUsers = filteredPerson?.sort(
    (a: PersonDBType, b: PersonDBType) => {
      const totalA = a.totalPopularity;
      const totalB = b.totalPopularity;
      return totalB - totalA;
    }
  );

  const getPersonData = persons?.filter((data: any) =>
    sortedUsers?.find(
      (p: PersonDBType) => p?.popularity[0]?.actorName === data?.name
    )
  );

  if (isLoading) {
    return <TopActorSkeleton />;
  }

  return (
    <div className="w-full max-w-[1808px] mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl flex items-center justify-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-300" />
        <h2 className="text-xl font-bold text-white">{heading}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#1a1d24] rounded-b-xl">
        {[0, 1, 2].map((index) => (
          <ActorCard
            key={index}
            actor={getPersonData?.[index]}
            rank={index + 1}
            popularity={sortedUsers?.[index]?.totalPopularity}
          />
        ))}
      </div>

      <TrendingSection />
    </div>
  );
}

function ActorCard({
  actor,
  rank,
  popularity,
}: {
  actor: any;
  rank: number;
  popularity: number;
}) {
  const bgColor =
    rank === 1 ? "bg-[#8B4513]" : rank === 2 ? "bg-[#1a2332]" : "bg-[#8B2513]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${bgColor} border-0 w-full`}>
        <CardContent className="p-3 flex items-center flex-wrap gap-3">
          <div className="relative">
            <Badge
              variant="secondary"
              className="absolute -top-2 -left-2 z-10 bg-yellow-500/80 text-white text-xs px-1.5"
            >
              #{rank}
            </Badge>
            <Link
              prefetch={false}
              href={`/person/${actor?.id}-${spaceToHyphen(actor?.name)}`}
              className="block"
            >
              <Avatar className="w-16 h-16 border-2 border-white/10">
                <AvatarImage
                  src={`https://image.tmdb.org/t/p/w185/${actor?.profile_path}`}
                  alt={actor?.name}
                  className="object-cover"
                />
                <AvatarFallback>{actor?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            <Link
              prefetch={false}
              href={`/person/${actor?.id}-${spaceToHyphen(actor?.name)}`}
              className="block"
            >
              <h3 className="text-lg font-semibold text-white truncate">
                {actor?.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-white/60 text-sm">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {actor?.place_of_birth || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Image src="/gift.svg" alt="gift" width={16} height={16} />
              <span className="text-pink-500 font-semibold">{popularity}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrendingSection() {
  return (
    <div className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-white" />
        <h4 className="text-lg font-semibold text-white">
          Who&apos;s the most loved Actor on MDI?
        </h4>
      </div>
      <Badge variant="secondary" className="bg-white text-blue-700">
        Trending Now
      </Badge>
    </div>
  );
}

function TopActorSkeleton() {
  return (
    <div className="w-full max-w-[1808px] mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl">
        <Skeleton className="h-6 w-40 mx-auto bg-white/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#1a1d24] rounded-b-xl">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="bg-gray-800 border-0">
            <CardContent className="p-3 flex items-center gap-3">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}
