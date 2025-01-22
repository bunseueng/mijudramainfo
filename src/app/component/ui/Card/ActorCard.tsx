import React from "react";
import Link from "next/link";
import { IActor } from "@/helper/type";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ActorCardT = {
  result: IActor;
  coverFromDB: any;
  idx: number;
  className?: string;
};

const ActorCard = ({ result, coverFromDB, idx, className }: ActorCardT) => {
  const { cast } = result;
  const actor = cast.find(
    (actor: any) => actor.name && actor.profile_path !== null
  );

  if (!actor) return null;

  const { name, id: person, profile_path, known_for_department } = actor;
  const actorSlug = `${person}-${name.replace(/ /g, "-").toLowerCase()}`;
  const initials = name
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
          prefetch={true}
          aria-label={`Visit ${name}'s profile page?`}
        >
          <Avatar className="w-[150px] h-[150px] mx-auto mb-4 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105">
            <AvatarImage
              src={
                coverFromDB?.cover ||
                `https://image.tmdb.org/t/p/w185/${profile_path}`
              }
              alt={`${name}'s avatar`}
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
            prefetch={true}
            aria-label={`Visit ${name}'s profile page?`}
          >
            <h3 className="font-semibold text-lg mb-1 hover:underline transition-colors duration-300">
              {name}
            </h3>
          </Link>
          <Badge
            variant="secondary"
            className="mt-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            {known_for_department}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActorCard;
