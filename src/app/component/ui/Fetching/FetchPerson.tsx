"use client";

import Image from "next/image";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import Drama from "../../../(route)/(id)/person/[id]/Drama";
import VarietyShow from "../../../(route)/(id)/person/[id]/VarietyShow";
import PersonMovie from "@/app/(route)/(id)/person/[id]/PersonMovie";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPerson,
  fetchPersonCombinedCredits,
  fetchPersonMovie,
  fetchPersonSearch,
  fetchPersonTv,
} from "@/app/actions/fetchMovieApi";
import { toast } from "react-toastify";
import { personLove, TPersonLove } from "@/helper/zod";
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
import { personPopularity } from "@/helper/item-list";
import PopularityModal from "../Modal/PopularityModal";
import { AnimatePresence, motion } from "framer-motion";
import {
  CommentProps,
  currentUserProps,
  PersonDBType,
  UserProps,
} from "@/helper/type";
import Link from "next/link";

type UserTotalPopularity = {
  itemId: string;
  totalPopularity: number;
  actorName: string;
};

interface IFetchPerson {
  tv_id: number;
  currentUser: currentUserProps | null;
  users: UserProps[];
  getComment: CommentProps[] | null;
  getPersons: PersonDBType | null;
  sortedUsers: UserProps[] | null;
}

const FetchPerson: React.FC<IFetchPerson> = ({
  tv_id,
  currentUser,
  users,
  getComment,
  getPersons,
  sortedUsers,
}) => {
  const [more, setMore] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [getPerson, setGetPerson] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0); // Current index in popularitySent
  const [currentUserIndex, setCurrentUserIndex] = useState(0); // Current user index
  const router = useRouter();
  const { register, handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });
  const currentPage = "https://mijudramalist.com";

  const { data: persons } = useQuery({
    queryKey: ["personId", tv_id],
    queryFn: () => fetchPerson(tv_id),
  });
  const { data: personFullDetails } = useQuery({
    queryKey: ["personFullDetails", persons?.name],
    queryFn: () => fetchPersonSearch(persons?.name),
  });
  const { data: getCredits } = useQuery({
    queryKey: ["getCredits", tv_id],
    queryFn: () => fetchPersonCombinedCredits(tv_id),
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

  const isCurrentUserLoved = getPersons?.lovedBy.find((item: any) =>
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

  const fetchRandomPerson = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/person/${persons?.id}/send-popularity`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error("Error fetching random person");
      }
      const data = await response.json();
      // Log the raw data to see its structure
      console.log("Raw fetched data:", data);
      if (data && typeof data === "object") {
        // Log each popularitySent item to see what's inside before filtering
        data.popularitySent?.forEach((popularityItem: any, index: number) => {
          console.log(`Popularity Sent Data ${index}:`, popularityItem);
        });
        // Proceed with filtering
        const filteredPopularitySent = data.popularitySent
          ?.filter((array: any) => Array.isArray(array) && array.length > 0)
          ?.map((array: any) =>
            array.filter(
              (item: any) =>
                item && typeof item === "object" && Object.keys(item).length > 0
            )
          );
        const filteredData = {
          ...data,
          popularitySent: filteredPopularitySent,
        };
        setGetPerson(filteredData);
      } else {
        throw new Error("Invalid data structure received");
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }, [persons?.id]);

  const sentByIds = getPerson?.sentBy || [];
  const getPersonDetail = users?.filter((user: any) =>
    sentByIds.includes(user?.id)
  );

  useEffect(() => {
    const fetchAndUpdatePerson = async () => {
      await fetchRandomPerson();
    };
    fetchAndUpdatePerson(); // Fetch initially
    const intervalId = setInterval(fetchAndUpdatePerson, 12000); // Fetch every 12 seconds
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [fetchRandomPerson]);

  useEffect(() => {
    if (getPersonDetail.length > 0) {
      const currentUser = getPersonDetail[currentUserIndex];
      let popularityArray = currentUser?.popularitySent?.[0] || []; // Access the first array
      if (popularityArray.length > 0) {
        const timer = setTimeout(() => {
          let validItemFound = false;
          let loopCount = 0; // To prevent infinite loops
          while (!validItemFound && loopCount < popularityArray.length * 2) {
            // loopCount to prevent infinite loops
            loopCount++;
            if (currentIndex < popularityArray.length - 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
              setCurrentIndex(0);
              setCurrentUserIndex(
                (prevUserIndex) => (prevUserIndex + 1) % getPersonDetail.length
              );
            }
            const item = popularityArray[currentIndex];
            if (item && Object.keys(item).length > 0) {
              validItemFound = true; // Stop the loop if a valid item is found
            }
          }

          if (!validItemFound) {
            console.log("No valid items found, moving to the next user");
            setCurrentIndex(0); // Reset index to start from the first item of the next user
            setCurrentUserIndex(
              (prevUserIndex) => (prevUserIndex + 1) % getPersonDetail.length
            );
          }
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, currentUserIndex, getPersonDetail]);
  const currentUsers = getPersonDetail[currentUserIndex];
  const currentPopularityItem =
    currentUsers?.popularitySent?.[0]?.[currentIndex];

  useEffect(() => {
    if (!currentPopularityItem) {
      console.log("error");
      return;
    }
    let validItems;
    if (Array.isArray(currentPopularityItem)) {
      validItems = currentPopularityItem.filter(
        (item) => item !== undefined && Object.keys(item).length > 0
      );
    } else if (
      typeof currentPopularityItem === "object" &&
      Object.keys(currentPopularityItem).length > 0
    ) {
      validItems = [currentPopularityItem];
    } else {
      console.log("error");
      return;
    }
    if (validItems.length === 0) {
      console.log("error");
      return;
    }
    validItems.forEach((item) => {
      console.log("Popularity Sent Data:", item);
    });
  }, [currentPopularityItem]);

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = openModal ? "hidden" : "auto";
    // Clean up the effect
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  return (
    <>
      <div className="max-w-7xl mx-auto pt-0 pb-4 px-2 md:px-5 my-10 md:my-20 overflow-hidden">
        <div className="min-w-[80%] h-full flex flex-col min-[560px]:flex-row justify-between">
          <div className="w-full min-[560px]:w-[40%] lg:w-[30%] h-full">
            <div className="block bg-white dark:bg-[#242526] border-[1px] border-[#00000024] dark:border-[#232425] rounded-md">
              <div className="lg:w-full h-full min-h-full flex items-center justify-center md:justify-start p-4">
                <Image
                  src={`https://image.tmdb.org/t/p/original/${
                    persons?.profile_path || persons?.poster_path
                  }`}
                  alt={`${persons?.name}'s Avartar`}
                  width={600}
                  height={600}
                  quality={100}
                  className="rounded-md bg-center bg-cover object-cover w-full h-[500px] md:w-full min-[560px]:h-[300px] lg:w-full min-[900px]:h-[500px]"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-center p-4">
                  <div className="px-10">
                    <p className="text-center text-black dark:text-[#ffffffde] text-lg font-bold">
                      0
                    </p>
                    <p className="text-[#818a91] text-sm">Followers</p>
                  </div>
                  <div className="px-10">
                    <p className="text-center text-black dark:text-[#ffffffde] text-lg font-bold">
                      {getPersons?.love}
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
                        <span className="pl-1">{getPersons?.love}</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <GoHeart {...register("love")} className="text-2xl" />
                        <span className="pl-1">{getPersons?.love}</span>
                      </span>
                    )}
                  </button>
                </div>

                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">
                    Native Name
                  </h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {personFullDetails?.results[0]?.original_name}
                  </p>
                </div>
                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">Career</h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {persons?.known_for_department}
                  </p>
                </div>
                <div className="my-2">
                  <h1 className="text-md font-semibold px-3 md:px-6">
                    Known Credits
                  </h1>
                  <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                    {getCredits?.cast?.length + getCredits?.crew?.length}
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
                      <div className="inline-block" key={index}>
                        {persons?.biography === "" ? (
                          <div className="text-lg font-bold text-center py-5">
                            Sorry!! This person currently has no biography.
                          </div>
                        ) : (
                          <div className="inline-block py-2 text-md">
                            <p className="inline-block ">
                              {paragraph}{" "}
                              <span className=" ">
                                <Link
                                  href={`/person/${persons?.id}/edit`}
                                  className="text-sm text-[#1675b6]"
                                  onClick={() => setMore(!more)}
                                >
                                  Edit Translation
                                </Link>
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#242526] border-[1px] border-[#00000024] dark:border-[#232425] rounded-md mt-5 hidden min-[560px]:block">
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Native Name
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {personFullDetails?.results[0]?.original_name}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">Career</h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {persons?.known_for_department}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Known Credits
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-sm font-normal px-3 md:px-6">
                  {getCredits?.cast?.length + getCredits?.crew?.length}
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

            <div className="w-full bg-white dark:bg-[#242526] border-[1px] border-[#00000024] dark:border-[#232425] rounded-md mt-5 overflow-hidden">
              <div className="flex items-center justify-center py-5">
                <Image
                  src={`https://image.tmdb.org/t/p/original/${
                    persons?.profile_path || persons?.poster_path
                  }`}
                  alt={`${persons?.name}'s Avartar`}
                  width={600}
                  height={600}
                  quality={100}
                  className="w-20 h-20 rounded-full bg-center bg-cover object-cover"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {personPopularity?.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <Image
                      src={`/${item?.image}`}
                      alt={`${item?.name}`}
                      width={100}
                      height={100}
                      className="w-12 h-12 bg-cover bg-center object-cover mx-2"
                    />
                    <div>
                      <div className="font-bold text-md text-black dark:text-white">
                        {getPersons?.popularity?.find(
                          (pop: any) => pop?.itemId === item?.name
                        )?.starCount || 0}
                      </div>
                      <div className="font-bold text-sm text-[#00000099] dark:text-[#ffffff99] uppercase">
                        {item?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[#00000099] dark:text-[#ffffff99] text-center text-sm my-2">
                Support your favorite stars by sending virtual flowers to boost
                their popularity.
              </p>
              <div className="relative mx-2 pb-8">
                <button
                  className="block w-full text-white font-bold bg-[#1675b6] border-[1px] border-[#1675b6] hover:bg-[#115889] hover:border-[#0f527f] rounded-md py-2 my-2 mx-auto max-w-xs transform duration-300"
                  onClick={() => setOpenModal(!openModal)}
                >
                  Send Popularity
                </button>
                {openModal && (
                  <PopularityModal
                    currentUser={currentUser}
                    persons={persons}
                    setOpenModal={setOpenModal}
                    tv_id={tv_id}
                  />
                )}
                {currentPopularityItem?.actorName === persons?.name && (
                  <div className="h-auto overflow-hidden">
                    <AnimatePresence>
                      {currentUsers && currentPopularityItem && (
                        <motion.div
                          key={currentPopularityItem.itemId}
                          initial={{ opacity: 0, y: "100%" }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: "100%" }}
                          transition={{
                            type: "tween",
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                          className="absolute bottom-0 left-0 w-full flex items-center justify-center"
                        >
                          <div className="flex items-center">
                            <Image
                              src={
                                currentUsers?.profileAvatar ||
                                currentUsers?.image ||
                                "/empty-pf.jpg"
                              }
                              alt={`${currentUsers?.name}'s Profile`}
                              width={100}
                              height={100}
                              className="w-6 h-6 bg-center object-cover rounded-full"
                            />
                            <div className="flex items-center ml-2">
                              <p className="text-xs text-[#2490da] font-semibold px-1">
                                {currentUsers?.displayName ||
                                  currentUsers?.name}
                              </p>
                              <div>
                                <p className="text-xs">
                                  Sent{" "}
                                  <span>
                                    {currentPopularityItem?.starCount}
                                  </span>{" "}
                                  <span>{currentPopularityItem?.itemId}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              {sortedUsers?.map((user, idx: number) => (
                <div key={idx}>
                  <div className="border-y-[1px] border-y-[#06090c21] dark:border-y-[#3e4042] mt-4">
                    <div className="mx-2 py-5">
                      <h1 className="text-center lg:text-lg">
                        Top Popularity Senders
                      </h1>
                      <div className="flex items-center mt-3">
                        <Image
                          src={`/${
                            idx === 0
                              ? `gold-medal.svg`
                              : idx === 1
                              ? `silver-medal.svg`
                              : "bronze-medal.svg"
                          }`}
                          alt="medal"
                          width={100}
                          height={100}
                          className="w-10 h-10 bg-cover object-cover"
                        />
                        <div className="flex items-center my-2">
                          <Image
                            src={
                              user?.profileAvatar ||
                              user?.image ||
                              "/empty-pf.jpg"
                            }
                            alt={`${user?.name}'s Avartar`}
                            width={100}
                            height={100}
                            className="w-10 h-10 bg-cover object-cover rounded-full"
                          />
                          <div className="inline-block ml-2">
                            <p className="inline-block text-md text-[#2490da] font-semibold px-1">
                              {user?.displayName || user?.name}
                            </p>
                            <p className="text-xs text-[#00000099] dark:text-[#ffffff99] font-semibold px-1">
                              {user?.totalPopularitySent?.map(
                                (sent: UserTotalPopularity) =>
                                  sent?.totalPopularity
                              )}{" "}
                              <span>popularity</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full text-center p-3">
                    <Link href="" className="text-[#2196f3]">
                      See all
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full min-[560px]:w-[60%] lg:w-[70%] min-[560px]:px-4 mt-4 min-[560px]:mt-0 ">
            <div className="w-full h-full">
              <div className="hidden min-[560px]:block">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl text-[#2490da] font-bold">
                    {persons?.displayName || persons?.name}
                  </h1>
                  <button onClick={handleSubmit(handleLove)}>
                    {isCurrentUserLoved ? (
                      <span className="flex items-center text-red-600">
                        <GoHeart {...register("love")} className="text-2xl" />
                        <span className="pl-1">{getPersons?.love}</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <GoHeart {...register("love")} className="text-2xl" />
                        <span className="pl-1">{getPersons?.love}</span>
                      </span>
                    )}
                  </button>
                </div>

                <p className="text-2xl font-bold pt-5">Biography: </p>
                {/* Render biography paragraphs */}
                {persons?.biography
                  ?.split("\n")
                  ?.map((paragraph: string, index: number) => (
                    <div className="inline-block" key={index}>
                      {persons?.biography === "" ? (
                        <div className="text-lg font-bold text-center py-5">
                          Sorry!! This person currently has no biography.
                        </div>
                      ) : (
                        <div className="inline-block py-2 text-md">
                          <p className="inline-block ">
                            {paragraph}{" "}
                            <span className=" ">
                              <Link
                                href={`/person/${persons?.id}/edit`}
                                className="text-sm text-[#1675b6]"
                                onClick={() => setMore(!more)}
                              >
                                Edit Translation
                              </Link>
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              <div className="mt-5">
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
          <Suspense fallback={<div>Loading...</div>}>
            <Discuss
              user={currentUser}
              users={users}
              getComment={getComment}
              tv_id={tv_id}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default FetchPerson;
