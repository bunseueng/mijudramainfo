"use client";

import Image from "next/image";
import React, { Suspense, useCallback, useEffect, useState } from "react";
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
import { personPopularity } from "@/helper/item-list";
import { AnimatePresence, motion } from "framer-motion";
import {
  CommentProps,
  currentUserProps,
  PersonDBType,
  UserProps,
} from "@/helper/type";
import Link from "next/link";
import dynamic from "next/dynamic";
import LazyImage from "@/components/ui/lazyimage";
import Drama from "@/app/(route)/(id)/person/[id]-[slug]/Drama";
import VarietyShow from "@/app/(route)/(id)/person/[id]-[slug]/VarietyShow";
import PersonMovie from "@/app/(route)/(id)/person/[id]-[slug]/PersonMovie";
import Discuss from "@/app/(route)/(id)/tv/[id]-[slug]/discuss/Discuss";
const PopularityModal = dynamic(() => import("../Modal/PopularityModal"), {
  ssr: false,
});

type UserTotalPopularity = {
  itemId: string;
  personId: string;
  totalPopularity: number;
  actorName: string;
};

interface IFetchPerson {
  tv_id: number;
  currentUser: currentUserProps | null;
  users: UserProps[];
  getComment: CommentProps[] | any;
  getPersons: PersonDBType | null;
  sortedUsers: UserProps[] | null;
  getPersonDB: PersonDBType[] | any;
}

const FetchPerson: React.FC<IFetchPerson> = ({
  tv_id,
  currentUser,
  users,
  getComment,
  getPersons,
  sortedUsers,
  getPersonDB,
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
  const currentPage = `https://mijudramalist.com/person/${tv_id}`;

  const { data: persons } = useQuery({
    queryKey: ["personId", tv_id],
    queryFn: () => fetchPerson(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: personFullDetails } = useQuery({
    queryKey: ["personFullDetails", persons?.name],
    queryFn: () => fetchPersonSearch(persons?.name),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: getCredits } = useQuery({
    queryKey: ["getCredits", tv_id],
    queryFn: () => fetchPersonCombinedCredits(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: drama } = useQuery({
    queryKey: ["tv", tv_id],
    queryFn: () => fetchPersonTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: movie } = useQuery({
    queryKey: ["movie", tv_id],
    queryFn: () => fetchPersonMovie(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const coverFromDB = getPersonDB?.find((p: any) =>
    p?.personId?.includes(tv_id)
  );
  const birthDate = new Date(persons?.birthday);
  const ageDiffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiffMs);
  // For known credits calculation
  const knownCredits =
    (getCredits?.cast?.length || 0) + (getCredits?.crew?.length || 0);

  // For age calculation
  const calculatedAge = persons?.birthday
    ? Math.abs(
        new Date(
          Date.now() - new Date(persons.birthday).getTime()
        ).getUTCFullYear() - 1970
      )
    : 0;

  const getCast = drama?.cast
    ?.sort(
      (a: any, b: any) =>
        new Date(b.first_air_date).getTime() -
        new Date(a.first_air_date).getTime()
    )
    .map((item: any) => item.character);

  const uniqueChanges = Array.from(
    new Map(
      getPersons?.changes?.map((change) => [change.userId, change])
    ).values()
  );

  // Fix: Initialize `userContributions` as an object, not an array
  const userContributions =
    getPersons?.changes?.reduce(
      (acc: Record<string, number>, change) => {
        // Increment the count of changes for each userId
        acc[change.userId] = (acc[change.userId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number> // Initial value as an empty object
    ) || {}; // Default to an empty object if `getPersons?.changes` is undefined

  // Step 2: Sort the uniqueChanges based on the number of contributions for each userId
  const sortedChanges = uniqueChanges?.sort((a, b) => {
    // Get the count of contributions for userId in `a` and `b`
    const countA = userContributions[a.userId] || 0;
    const countB = userContributions[b.userId] || 0;

    // Sort in descending order, i.e., users with more contributions come first
    return countB - countA;
  });

  const isCurrentUserLoved = getPersons?.lovedBy.find((item: any) =>
    item.includes(currentUser?.id)
  );

  const handleLove = async (data: TPersonLove) => {
    if (!currentUser) {
      toast.error("Please login to love this person");
      return;
    }

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
    } catch (error) {
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
      if (data && typeof data === "object") {
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

  const currentUsers = getPersonDetail[currentUserIndex];
  const currentPopularityItem = currentUsers?.popularitySent.flat();
  const filteredPopularity = currentPopularityItem?.filter(
    (p: any) => p?.personId === getPersons?.personId
  );

  useEffect(() => {
    if (getPersonDetail.length > 0) {
      const currentUser = getPersonDetail[currentUserIndex];
      let popularityArray = currentUser?.popularitySent || []; // Access the popularitySent array

      // Ensure array is properly flattened and has valid items
      if (popularityArray.length > 0) {
        const timer = setTimeout(() => {
          let nextIndex = currentIndex + 1;
          let nextUserIndex = currentUserIndex;

          // Check if currentIndex exceeds array length, cycle to next user
          if (nextIndex >= filteredPopularity.length) {
            nextIndex = 0;
            nextUserIndex = (currentUserIndex + 1) % getPersonDetail.length;
          }

          // Update state with the new indices
          setCurrentIndex(nextIndex);
          setCurrentUserIndex(nextUserIndex);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [
    currentIndex,
    currentUserIndex,
    getPersonDetail,
    filteredPopularity?.length,
  ]);

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
    <div className="max-w-6xl mx-auto pt-0 pb-4 px-2 md:px-5 my-10 overflow-hidden">
      <div className="min-w-[80%] h-full flex flex-col min-[560px]:flex-row justify-between">
        <div className="w-full min-[560px]:w-[40%] lg:w-[30%] h-full">
          <div className="block bg-white dark:bg-[#242526] border-[1px] border-[#00000024] dark:border-[#232425] rounded-md">
            <div className="lg:w-full h-full min-h-full flex items-center justify-center md:justify-start p-4">
              <LazyImage
                coverFromDB={coverFromDB?.cover}
                src={`https://image.tmdb.org/t/p/h632/${persons?.profile_path}`}
                alt={`${persons?.name}'s Avartar`}
                width={600}
                height={600}
                quality={100}
                className="rounded-md bg-center bg-cover object-cover w-full "
                priority
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
                    {getPersons?.love ? getPersons?.love : 0}
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

                <button name="Love icon" onClick={handleSubmit(handleLove)}>
                  {isCurrentUserLoved ? (
                    <span
                      className="flex items-center text-red-600"
                      {...register("love")}
                    >
                      <GoHeart className="text-2xl" />
                      <span className="pl-1">{getPersons?.love || 0}</span>
                    </span>
                  ) : (
                    <span className="flex items-center" {...register("love")}>
                      <GoHeart className="text-2xl" />
                      <span className="pl-1">{getPersons?.love || 0}</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Native Name
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                  {personFullDetails?.results[0]?.original_name}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">Career</h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                  {persons?.known_for_department}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Known Credits
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                  {String(knownCredits)}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">Gender</h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                  {persons?.gender === 1 ? "Female" : "Male"}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">Birthday</h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                  {persons?.birthday} ({calculatedAge} years old)
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Place of Birth
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                  {persons?.place_of_birth}
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-md font-semibold px-3 md:px-6">
                  Also Known As
                </h1>
                <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                  {(persons?.also_known_as || []).join(" , ")}
                </p>
              </div>
              <div className="inline-block px-3 mt-5">
                <p className="text-xl font-bold">Biography: </p>
                {/* Render biography paragraphs */}
                {persons?.biography
                  ?.split("\n")
                  ?.map((paragraph: string, index: number) => (
                    <span key={index} className="text-sm">
                      {persons?.biography === "" ? (
                        <div className="text-md font-semibold text-center py-5">
                          {persons?.name} currently has no biography.
                        </div>
                      ) : (
                        <span>
                          {paragraph}
                          {index ===
                            persons?.biography.split("\n").length - 1 && (
                            <Link
                              href={`/person/${persons?.id}/edit`}
                              className="text-sm text-[#1675b6] ml-1"
                              onClick={() => setMore(!more)}
                            >
                              Edit Translation
                            </Link>
                          )}
                        </span>
                      )}
                      <br />{" "}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#242526] border-[1px] border-[#00000024] dark:border-[#232425] rounded-md mt-5 hidden min-[560px]:block">
            <div className="my-2">
              <h1 className="text-md font-semibold px-3 md:px-6">
                Native Name
              </h1>
              <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                {personFullDetails?.results[0]?.original_name}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-md font-semibold px-3 md:px-6">Career</h1>
              <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                {persons?.known_for_department}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-md font-semibold px-3 md:px-6">
                Known Credits
              </h1>
              <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                {getCredits?.cast?.length + (getCredits?.crew?.length || 0)}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-md font-semibold px-3 md:px-6">Gender</h1>
              <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                {persons?.gender === 1 ? "Female" : "Male"}
              </p>
            </div>

            <div className="my-2">
              <h1 className="text-md font-semibold px-3 md:px-6">Birthday</h1>
              <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                {persons?.birthday} ({calculatedAge} years old)
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-md font-semibold px-3 md:px-6">
                Place of Birth
              </h1>
              <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                {persons?.place_of_birth}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-md font-semibold px-3 md:px-6">
                Also Known As
              </h1>
              <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
                {persons?.also_known_as?.join(" , ")}
              </p>
            </div>
          </div>
          <div className="w-full bg-white dark:bg-[#242526] border-[1px] border-[#00000024] dark:border-[#232425] rounded-md mt-5 overflow-hidden">
            <div className="flex items-center justify-center py-5">
              <LazyImage
                coverFromDB={coverFromDB?.cover}
                src={`https://image.tmdb.org/t/p/h632/${persons?.profile_path}`}
                alt={`${persons?.name}'s Avartar`}
                width={600}
                height={600}
                quality={100}
                className="w-20 h-20 rounded-full bg-center bg-cover object-cover"
                priority
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
                    quality={90}
                    className="w-12 h-12 bg-cover bg-center object-cover mx-2"
                    priority
                  />
                  <div>
                    <div className="font-bold text-md text-black dark:text-white">
                      {String(
                        getPersons?.popularity?.find(
                          (pop: any) => pop?.itemId === item?.name
                        )?.starCount || 0
                      ).toString()}
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
            <div
              className={`relative mx-2 ${
                filteredPopularity?.length > 0 ? "pb-8" : "pb-0"
              }`}
            >
              <button
                name="Popularity Button"
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
              {currentPopularityItem?.actorName !== persons?.name && (
                <div className="h-auto overflow-hidden">
                  <AnimatePresence>
                    {currentUsers && filteredPopularity[currentIndex] && (
                      <motion.div
                        key={filteredPopularity[currentIndex].personId}
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
                              "/placeholder-image.avif"
                            }
                            alt={`${currentUsers?.name}'s Profile`}
                            width={100}
                            height={100}
                            quality={90}
                            className="w-6 h-6 bg-center object-cover rounded-full"
                            priority
                          />
                          <div className="flex items-center ml-2">
                            <p className="text-xs text-[#2490da] font-semibold px-1">
                              {currentUsers?.displayName || currentUsers?.name}
                            </p>
                            <div>
                              <p className="text-xs">
                                Sent{" "}
                                <span>
                                  {String(
                                    filteredPopularity?.[currentIndex]
                                      ?.starCount || 0
                                  )}
                                </span>{" "}
                                <span>
                                  {filteredPopularity?.[currentIndex]?.itemId ||
                                    ""}
                                </span>
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
            {filteredPopularity?.length > 0 && (
              <>
                <div className="border-y-[1px] border-y-[#06090c21] dark:border-y-[#3e4042] mt-4">
                  <div className="mx-2 py-5">
                    <h1 className="text-center lg:text-lg">
                      Top Popularity Senders
                    </h1>
                    {sortedUsers?.map((user, idx: number) => (
                      <div className="flex items-center mt-3" key={idx}>
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
                          priority
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
                            quality={90}
                            className="w-10 h-10 bg-cover object-cover rounded-full"
                            priority
                          />
                          <div className="inline-block ml-2">
                            <p className="inline-block text-md text-[#2490da] font-semibold px-1">
                              {user?.displayName || user?.name}
                            </p>
                            <p className="text-xs text-[#00000099] dark:text-[#ffffff99] font-semibold px-1">
                              {String(
                                user?.totalPopularitySent
                                  ?.filter(
                                    (p: any) =>
                                      p?.personId === getPersons?.personId
                                  )
                                  ?.map(
                                    (sent: UserTotalPopularity) =>
                                      sent?.totalPopularity || 0
                                  )[0] || 0
                              )}{" "}
                              <span>popularity</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full text-center p-3">
                  <Link href="" className="text-[#2196f3]">
                    See all
                  </Link>
                </div>
              </>
            )}
          </div>{" "}
          {sortedChanges?.length > 0 && (
            <div className="my-5">
              <h1 className="font-bold text-lg">Top Contributors</h1>
              {sortedChanges?.slice(0, 4)?.map((drama: any, idx) => {
                const getUser = users?.find((users: UserProps) =>
                  users?.id?.includes(drama?.userId)
                );
                const userContributions =
                  getPersons?.changes?.reduce(
                    (acc: Record<string, number>, change) => {
                      // Increment the count of changes for each userId
                      acc[change.userId] = (acc[change.userId] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number> // Initial value as an empty object
                  ) || {};
                const userContributeCount =
                  userContributions[drama.userId] || 0;

                return (
                  <div className="flex items-center py-2" key={idx}>
                    <div className="block">
                      <Image
                        src={
                          getUser?.profileAvatar || (getUser?.image as string)
                        }
                        alt={getUser?.displayName || (getUser?.name as string)}
                        width={100}
                        height={100}
                        loading="lazy"
                        className="size-[40px] object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col pl-2">
                      <p className="text-[#2196f3]">
                        {getUser?.displayName || getUser?.name}
                      </p>
                      <p className="text-sm">
                        {String(userContributeCount)} edits
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="w-full min-[560px]:w-[60%] lg:w-[70%] min-[560px]:px-8 mt-4 min-[560px]:mt-0">
          <div className="w-full h-full">
            <div className="hidden min-[560px]:block">
              <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl text-[#2490da] font-bold">
                  {persons?.displayName || persons?.name}
                </h1>
                <button
                  {...register("love")}
                  className="flex items-center"
                  name="Love icon"
                  onClick={handleSubmit(handleLove)}
                >
                  {isCurrentUserLoved ? (
                    <span className="flex items-center text-red-600">
                      <GoHeart className="text-2xl" />
                      <span className="pl-1">
                        {String(getPersons?.love || 0)}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <GoHeart className="text-2xl" />
                      <span className="pl-1">
                        {String(getPersons?.love || 0)}
                      </span>
                    </span>
                  )}
                </button>
              </div>

              <div className="inline-block mt-5">
                <p className="text-md md:text-lg font-semibold">Biography: </p>
                {/* Render biography paragraphs */}
                {persons?.biography
                  ?.split("\n")
                  ?.map((paragraph: string, index: number) => (
                    <span key={index} className="text-sm">
                      {persons?.biography === "" ? (
                        <div className="text-sm text-center">
                          {persons?.name} currently has no biography.
                        </div>
                      ) : (
                        // Use a span for the last paragraph to keep it inline with the link
                        <span>
                          {paragraph}
                          {/* Render the "Edit Translation" link inline with the last paragraph */}
                          {index ===
                            persons?.biography.split("\n").length - 1 && (
                            <Link
                              href={`/person/${persons?.id}/edit`}
                              className="text-sm text-[#1675b6] ml-1"
                              onClick={() => setMore(!more)}
                            >
                              Edit Translation
                            </Link>
                          )}
                        </span>
                      )}
                      <br />{" "}
                      {/* Add line breaks after each paragraph except the last one */}
                    </span>
                  ))}
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-10">
                <h1 className="text-md md:text-lg font-bold">Drama: </h1>
                {getCast === "" ? <Drama /> : <Drama data={drama} />}
              </div>
              <div className="mb-10">
                <h1 className="text-md md:text-lg font-bold">Movie: </h1>
                {getCast === "" ? <Drama /> : <PersonMovie data={movie} />}
              </div>
              <div className="mb-10">
                <h1 className="text-md md:text-lg font-bold">Variety Show: </h1>
                {getCast === "" ? <Drama /> : <VarietyShow data={drama} />}
              </div>
            </div>
            <div className="w-full float-right">
              <Suspense fallback={<div>Loading...</div>}>
                <Discuss
                  user={currentUser as UserProps | any}
                  users={users}
                  getComment={getComment}
                  tv_id={tv_id.toString()}
                  type="person"
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetchPerson;
