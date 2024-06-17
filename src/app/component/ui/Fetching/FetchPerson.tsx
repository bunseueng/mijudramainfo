"use client";

import Image from "next/image";
import React, { useState } from "react";
import Drama from "../../../(route)/(id)/person/[id]/Drama";
import VarietyShow from "../../../(route)/(id)/person/[id]/VarietyShow";
import PersonMovie from "@/app/(route)/(id)/person/[id]/PersonMovie";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPerson,
  fetchPersonMovie,
  fetchPersonTv,
} from "@/app/actions/fetchMovieApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GoHeart } from "react-icons/go";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import Discuss from "@/app/(route)/(id)/tv/[id]/discuss/Discuss";
import { personLove, TPersonLove } from "@/app/helper/zod";

const FetchPerson = ({
  tv_id,
  currentUser,
  users,
  getComment,
  getLoveofPerson,
}: any) => {
  const [more, setMore] = useState<boolean>(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });
  const currentPage = "https://mijudramalist.com";

  const { data: persons } = useQuery({
    queryKey: ["personId", tv_id],
    queryFn: () => fetchPerson(tv_id),
  });
  const { data: drama } = useQuery({
    queryKey: ["tv", tv_id],
    queryFn: () => fetchPersonTv(tv_id),
  });
  const { data: movie } = useQuery({
    queryKey: ["movie", tv_id],
    queryFn: () => fetchPersonMovie(tv_id),
  });

  const birthDate = new Date(persons?.birthday);
  const ageDiffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiffMs);
  const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
  const getCast = drama?.cast
    ?.sort(
      (a: any, b: any) =>
        new Date(b.first_air_date).getTime() -
        new Date(a.first_air_date).getTime()
    )
    .map((item: any) => item.character);

  const isCurrentUserLoved = getLoveofPerson?.lovedBy.find((item: any) =>
    item.includes(currentUser?.id)
  );

  const handleLove = async (data: TPersonLove) => {
    try {
      const res = await fetch(`/api/person/${persons?.id}/love`, {
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
    <>
      <div className="max-w-7xl mx-auto pt-0 pb-4 px-2 md:px-5 my-10 md:my-20 overflow-hidden">
        <div className="min-w-[80%] h-full flex flex-col min-[560px]:flex-row justify-between">
          <div className="w-full min-[560px]:w-[40%] lg:w-[30%] h-full">
            <div className="block border border-[#232425] bg-[#242526] rounded-md">
              <div className="lg:w-full h-full min-h-full flex items-center justify-center md:justify-start p-4">
                <Image
                  src={`https://image.tmdb.org/t/p/original/${
                    persons?.profile_path || persons?.poster_path
                  }`}
                  alt="image"
                  width={600}
                  height={600}
                  quality={100}
                  className="rounded-md bg-center bg-cover object-cover w-full h-[500px] md:w-full min-[560px]:h-[300px] lg:w-full min-[900px]:h-[500px]"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-center p-4">
                  <div className="px-10">
                    <p className="text-center text-[#ffffffde] text-lg font-bold">
                      0
                    </p>
                    <p className="text-[#818a91] text-sm">Followers</p>
                  </div>
                  <div className="px-10">
                    <p className="text-center text-[#ffffffde] text-lg font-bold">
                      {getLoveofPerson?.love}
                    </p>
                    <p className="text-[#818a91] text-sm">Hearts</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <FacebookShareButton
                    url={currentPage}
                    quote={persons?.biography}
                    hashtag="#drama"
                  >
                    <FacebookIcon round={true} size={35} className="mr-3" />
                  </FacebookShareButton>
                  <TwitterShareButton url={currentPage} title={persons?.name}>
                    <TwitterIcon round={true} size={35} className="mr-3" />
                  </TwitterShareButton>
                  <RedditShareButton url={currentPage} title={persons?.name}>
                    <RedditIcon round={true} size={35} className="mr-3" />
                  </RedditShareButton>
                  <PinterestShareButton
                    url={currentPage}
                    media={persons}
                    title="The best site to find your favorite drama"
                  >
                    <PinterestIcon round={true} size={35} className="mr-1" />
                  </PinterestShareButton>
                </div>
              </div>
              <div className="min-[560px]:hidden">
                <div className="flex items-center justify-between px-3">
                  <h1 className="text-xl text-[#2490da] font-bold">
                    {persons?.name}
                  </h1>

                  <button onClick={handleSubmit(handleLove)}>
                    {isCurrentUserLoved ? (
                      <span className="flex items-center text-red-600">
                        <GoHeart {...register("love")} className="text-2xl" />
                        <span className="pl-1">{getLoveofPerson?.love}</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <GoHeart {...register("love")} className="text-2xl" />
                        <span className="pl-1">{getLoveofPerson?.love}</span>
                      </span>
                    )}
                  </button>
                </div>
                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">Career</h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {persons?.known_for_department}
                  </p>
                </div>
                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">Gender</h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {persons?.gender === 1 ? "Female" : "Male"}
                  </p>
                </div>
                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">
                    Birthday
                  </h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {persons?.birthday} ({calculatedAge} years old)
                  </p>
                </div>
                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">
                    Place of Birth
                  </h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {persons?.place_of_birth}
                  </p>
                </div>
                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">
                    Also Known As
                  </h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {persons?.also_known_as?.join(" , ")}
                  </p>
                </div>
                <div className="px-3 mt-5">
                  <p className="text-xl font-bold">Biography: </p>
                  {/* Render biography paragraphs */}
                  {persons?.biography
                    ?.split("\n")
                    ?.map((paragraph: string, index: number) => (
                      <>
                        {persons?.biography === "" ? (
                          <div className="text-lg font-bold text-center py-5">
                            Sorry!! This person currently has no biography.
                          </div>
                        ) : (
                          <p key={index} className="py-2 text-md">
                            {paragraph}
                          </p>
                        )}
                      </>
                    ))}
                </div>
              </div>
            </div>
            <div className="border border-[#232425] bg-[#242526] rounded-md mt-5 hidden min-[560px]:block">
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">Career</h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {persons?.known_for_department}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">Gender</h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {persons?.gender === 1 ? "Female" : "Male"}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">Birthday</h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {persons?.birthday} ({calculatedAge} years old)
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Place of Birth
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {persons?.place_of_birth}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Also Known As
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {persons?.also_known_as?.join(" , ")}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full min-[560px]:w-[60%] lg:w-[70%] min-[560px]:px-4 mt-4 min-[560px]:mt-0 ">
            <div className="w-full h-full">
              <div className="hidden min-[560px]:block">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl text-[#2490da] font-bold">
                    {persons?.name}
                  </h1>
                  <button onClick={handleSubmit(handleLove)}>
                    {isCurrentUserLoved ? (
                      <span className="flex items-center text-red-600">
                        <GoHeart {...register("love")} className="text-2xl" />
                        <span className="pl-1">{getLoveofPerson?.love}</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <GoHeart {...register("love")} className="text-2xl" />
                        <span className="pl-1">{getLoveofPerson?.love}</span>
                      </span>
                    )}
                  </button>
                </div>

                <p className="text-2xl font-bold pt-5">Biography: </p>
                {/* Render biography paragraphs */}
                {persons?.biography
                  ?.split("\n")
                  ?.map((paragraph: string, index: number) => (
                    <>
                      {persons?.biography === "" ? (
                        <div className="text-lg font-bold text-center py-5">
                          Sorry!! This person currently has no biography.
                        </div>
                      ) : (
                        <p key={index} className="py-2 text-md">
                          {paragraph}
                        </p>
                      )}
                    </>
                  ))}
              </div>
              <div className="mt-5">
                <p
                  className="text-1xl text-purple-500 text-end"
                  onClick={() => setMore(!more)}
                >
                  Read More
                </p>
                <div className="mb-10">
                  <h1 className="text-2xl font-bold">Drama: </h1>
                  {getCast === "" ? <Drama /> : <Drama data={drama} />}
                </div>
                <div className="mb-10">
                  <h1 className="text-2xl font-bold">Movie: </h1>
                  {getCast === "" ? <Drama /> : <PersonMovie data={movie} />}
                </div>
                <div className="mb-10">
                  <h1 className="text-2xl font-bold">Variety Show: </h1>
                  {getCast === "" ? <Drama /> : <VarietyShow data={drama} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[60%] lg:w-[70%] md:px-4 mt-4 md:mt-0 float-right">
          <Discuss
            user={currentUser}
            users={users}
            getComment={getComment}
            tv_id={tv_id}
          />
        </div>
      </div>
    </>
  );
};

export default FetchPerson;
