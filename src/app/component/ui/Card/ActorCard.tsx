import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Actor {
  character: string;
  id: number;
  name: string;
  order: number;
  popularity: number;
  profile_path: string;
}
type ActorCardT = {
  result: Actor;
  coverFromDB: any;
  className?: string;
};

const ActorCard = ({ result, coverFromDB, className }: ActorCardT) => {
  if (!result) return null;

  const actorSlug = `${result.id}-${result.name
    .replace(/ /g, "-")
    .toLowerCase()}`;
  const initials = result.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card
      className={`w-[180px] transition-all duration-300 hover:shadow-lg ${className} actor-card`}
    >
      <CardContent className="py-4">
        <Link
          href={`/person/${actorSlug}`}
          prefetch={false}
          aria-label={`Visit ${name}'s profile page?`}
        >
          <Avatar className="w-[150px] h-[150px] mx-auto mb-4 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105">
            <AvatarImage
              src={
                coverFromDB?.cover ||
                `https://image.tmdb.org/t/p/w185/${result.profile_path}` ||
                "/default-pf.webp"
              }
              alt={`${name}'s avatar` || "Person avatar"}
              className="object-cover"
              width={150}
              height={150}
              loading="lazy"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="text-center">
          <Link
            href={`/person/${actorSlug}`}
            prefetch={false}
            aria-label={`Visit ${name}'s profile page?`}
          >
            <h3 className="font-semibold text-lg mb-1 hover:underline transition-colors duration-300">
              {result?.name}
            </h3>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActorCard;
