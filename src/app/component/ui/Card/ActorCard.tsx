import LazyImage from "@/components/ui/lazyimage";
import { IActor } from "@/helper/type";
import Link from "next/link";
import React from "react";

type ActorCardT = {
  result: IActor;
  coverFromDB: any;
  idx: number;
};
const ActorCard = ({ result, coverFromDB, idx }: ActorCardT) => {
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
        prefetch={true}
        href={`/person/${person}`}
        className="block hover:relative transform duration-100 group"
        style={{ width: "auto", height: "auto" }}
      >
        <LazyImage
          coverFromDB={coverFromDB?.cover}
          src={backgroundImage?.profile_path}
          w={"h632"}
          alt={`${actorName}'s avatar`}
          width={150}
          height={200}
          quality={100}
          sizes="(max-width: 768px) 100vw, (min-width: 1024px) 150px"
          priority={idx < 2} // Prioritize loading first two images
          style={{ width: "auto", height: "auto" }}
          className="w-[150px] h-[200px] rounded-xl bg-center object-cover"
        />
      </Link>
      <div className="flex items-center justify-between">
        <Link
          prefetch={true}
          href={`/person/${person}`}
          className="text-xs truncate min-h-[20px]"
        >
          {actorName}
        </Link>
      </div>
    </div>
  ) : null;
};

export default ActorCard;
