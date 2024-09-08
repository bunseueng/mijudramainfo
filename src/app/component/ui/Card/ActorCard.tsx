import Image from "next/image";
import Link from "next/link";
import React from "react";

const ActorCard = ({ result }: any) => {
  // Extracting relevant data from the result object
  const { cast } = result;

  // Filter out actors with undefined names or image paths
  const validActors = cast.filter(
    (actor: any) => actor.name && actor.profile_path !== null
  );

  const backgroundImage =
    validActors.length > 0
      ? validActors.find((actor: any) => actor.profile_path !== null)
      : null;

  // Extracting actor/actress name
  const actorName = backgroundImage ? backgroundImage.name : null;
  const person = backgroundImage ? backgroundImage.id : null;

  return backgroundImage ? (
    <div className="w-[150px] h-[200px] bg-cover">
      <Link
        href={`/person/${person}`}
        className="block hover:relative transform duration-100 group"
      >
        {result?.profile_path !== null ? (
          <Image
            src={`https://image.tmdb.org/t/p/original/${backgroundImage.profile_path}`}
            alt={`${actorName}'s avatar`}
            width={600}
            height={600}
            quality={100}
            className="rounded-xl w-[150px] h-[200px] object-cover"
            priority
          />
        ) : (
          <Image
            src="/empty-img.jpg"
            alt={`${actorName}'s avatar`}
            width={600}
            height={600}
            quality={100}
            className="rounded-xl w-[150px] h-[200px] object-cover"
            priority
          />
        )}
      </Link>
      <div className="flex items-center justify-between">
        <Link href={`/person/${person}`} className="truncate">
          {actorName}
        </Link>
      </div>
    </div>
  ) : null;
};

export default ActorCard;
