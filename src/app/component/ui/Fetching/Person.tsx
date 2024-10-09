"use client";

import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { personLove, TPersonLove } from "@/helper/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GoHeart } from "react-icons/go";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import LazyImage from "@/components/ui/lazyimage";
export type PersonDb = {
  id: string;
  userID: string;
  personId: string;
  name: string | null;
  love: number | null;
  lovedBy: string[];
  popularity: Array<{
    itemId: string;
    starCount: number;
    actorName: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export default function Person({ result, currentUser, getPerson }: any) {
  const [getPersons, setGetPersons] = useState<PersonDb>();
  const person_id = result?.id;
  const router = useRouter();
  const { register, handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });
  const { data: person } = useQuery({
    queryKey: ["person", person_id],
    queryFn: () => fetchPerson(person_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });
  const coverFromDB = getPerson?.find((p: any) =>
    p?.personId?.includes(person_id)
  );

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/person/${result?.id}/love`, {
          method: "GET",
        });
        if (res.ok) {
          const data = await res.json();
          router.refresh();
          setGetPersons(data);
        } else {
          console.error("Failed to fetch person from API");
        }
      } catch (error) {
        console.error("Failed to fetch person from API:", error);
      }
    };
    fetchPerson();
  }, [result?.id, router]);

  const isCurrentUserLoved = getPersons?.lovedBy.find((item) =>
    item.includes(currentUser?.id)
  );
  const handleLove = async (data: TPersonLove) => {
    try {
      const res = await fetch(`/api/person/${result?.id}/love`, {
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
  return (
    <div className="p-5 relative box-border h-[90%]">
      <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
        <div className="relative">
          <Link
            prefetch={true}
            href={`/person/${result?.id}`}
            className="block box-content"
          >
            <LazyImage
              coverFromDB={coverFromDB?.cover}
              src={`https://image.tmdb.org/t/p/w185/${result.profile_path}`}
              alt={`${result?.name}'s Profile`}
              width={200}
              height={200}
              style={{ width: "100%", height: "100%" }}
              priority
              className="w-full object-cover align-middle overflow-clip"
            />
          </Link>
        </div>
      </div>
      <div className="flex float-left w-[75%]">
        <div className="w-full  px-2">
          <div className="flex items-center justify-between">
            <Link
              prefetch={true}
              href={`/person/${result?.id}`}
              className="text-[#2490da] text-md font-bold inline-block"
            >
              {result.title || result.name}
            </Link>
            <button name="Love icon" onClick={handleSubmit(handleLove)}>
              {isCurrentUserLoved ? (
                <span className="flex items-center text-red-600">
                  <GoHeart {...register("love")} />
                  <span className="pl-1">{getPerson?.love}</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <GoHeart {...register("love")} />
                  <span className="pl-1">{getPerson?.love}</span>
                </span>
              )}
            </button>
          </div>
          <div className="mb-2">
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground opacity-60 truncate">
                {person?.known_for_department}
              </p>
              <span
                className={`text-sm opacity-60 px-2 ${
                  !person?.place_of_birth ? "hidden" : "block"
                }`}
              >
                •
              </span>
              <p className="text-sm text-muted-foreground opacity-60 truncate">
                {person?.place_of_birth}
              </p>
            </div>
          </div>
          <div className="mb-2">
            {person?.biography === "" ? (
              <div className="text-md font-bold text-center py-5">
                Sorry!! This person currently has no biography.
              </div>
            ) : (
              <p className="line-clamp-4 text-sm truncate whitespace-normal">
                {person?.biography}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
