"use client";

import { createList, TCreateList } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit, CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { RiComputerLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { Lists } from "./Lists";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import dynamic from "next/dynamic";
const RatingModal = dynamic(
  () => import("@/app/component/ui/CircleRating/RatingModal"),
  { ssr: false }
);

interface listResultProps {
  listResult: any[] | undefined;
}

const ListCard: React.FC<Lists & listResultProps> = ({
  list,
  user,
  listResult,
  findSpecificRating,
  userRating,
  yourRating,
  currentUser,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // State to keep track of selected item's id
  const [modal, setModal] = useState<boolean>(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm<TCreateList>({
    resolver: zodResolver(createList),
  });

  // Get ratings for the items in listResult
  const ratings = findSpecificRating
    ?.filter(
      (rate: any) =>
        listResult &&
        listResult.some((item: any) => item.id.toString() === rate.tvId)
    )
    .map((rate: any) => ({
      ...rate,
      item: listResult?.find((item: any) => item.id.toString() === rate.tvId),
    }));

  const onSubmit = async (data: TCreateList) => {
    try {
      const res = await fetch(`/api/list/${list?.listId}`, {
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

  const tvIds = ratings?.map((item: any) => item?.tvId);

  const matchedIds = userRating?.filter((item: any) =>
    tvIds.includes(item.tvId)
  );

  const isUserList = ratings?.some(
    (rate: any) => rate?.rating?.userId === currentUser?.id?.toString()
  );

  return (
    <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto py-3 px-4 md:px-6">
      <div className="w-full h-full bg-white dark:bg-[#272727] border-[1px] border-slate-200 dark:border-[#272727] rounded-md my-5">
        <div className="p-3 mt-5">
          <div className="px-3">
            <div className="mb-5">
              <h1>{list?.listTitle}</h1>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Image
                  src={user?.profileAvatar || (user?.image as string)}
                  alt=""
                  width={200}
                  height={200}
                  quality={100}
                  className="block w-[40px] h-[40px] bg-center bg-cover object-cover rounded-full"
                />
                <div className="pl-3">
                  <h1>{user?.displayName || user?.name}</h1>
                  <p>{moment(list?.createdAt).fromNow()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center p-2 mb-5">
            <div className="flex items-center text-[#00000099] dark:text-[#ffffff99] mr-3">
              <span>
                <RiComputerLine size={18} />
              </span>
              <h1 className="text-sm pt-[2px] pl-1">
                {list?.tvId?.length || list?.movieId?.length} Titles
              </h1>
            </div>
            <div
              className="flex items-center text-[#00000099] dark:text-[#ffffff99] mr-3 cursor-pointer"
              onClick={handleSubmit(onSubmit)}
            >
              <span {...register("love")}>
                {list?.love ? (
                  <AiFillHeart size={18} className="text-red-600" />
                ) : (
                  <AiOutlineHeart size={18} className="text-[#00000099]" />
                )}
              </span>
              <h1 className="text-sm pt-[2px] pl-1">{list?.love} Loves</h1>
            </div>
            <Link
              href={`/lists/${list?.listId}/edit`}
              className="flex items-center text-[#00000099] dark:text-[#ffffff99] mr-3   "
            >
              <span>
                <CiEdit size={18} />
              </span>
              <h1 className="text-sm pt-[2px] pl-1">Edit</h1>
            </Link>
          </div>

          <div className="">
            <div className="w-full h-full float-left uppercase mb-2 pl-2 mx-0">
              <div className="float-left w-[35%] md:w-[58.33333%] px-0 relative">
                <h1 className="text-sm uppercase">Sort by:</h1>
              </div>
              <div className="float-right w-[65%] md:w-[41.6667%] px-0 relative text-end">
                <div className="mx-0">
                  <div className="float-left w-[60%] md:w-[66.66667%] text-end relative lg:pr-8">
                    {!isUserList && (
                      <b className="text-sm uppercase">
                        {user?.displayName || user?.name}&apos;s Rating
                      </b>
                    )}
                  </div>
                  <div
                    className={`float-right w-[40%] md:w-[33.33333%] text-end lg:text-center relative ${
                      isUserList && "w-[80%]"
                    }`}
                  >
                    <b className="text-sm uppercase">Your Rating</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="float-left w-full">
              {ratings?.map((rate: any, idx: number) => (
                <div
                  className="border-t-[1px] border-t-slate-300 dark:border-t-[#303030] py-3"
                  key={idx}
                >
                  <div className="flex flex-col -mx-3">
                    <div className="">
                      <div className="float-left w-[16.66667] px-3">
                        <Link
                          href={`/tv/${rate?.item?.id}`}
                          className="block text-[#2490da] border-md overflow-hidden "
                        >
                          <Image
                            src={`https://image.tmdb.org/t/p/original/${
                              rate?.item?.poster_path ||
                              rate?.item?.backdrop_path
                            }`}
                            alt="Image"
                            width={300}
                            height={300}
                            quality={100}
                            className="w-[100px] h-[150px] align-middle bg-center bg-cover object-cover bg-no-repeat rounded-md"
                          />
                        </Link>
                      </div>
                      <div className="float-left w-full lg:w-[85%] relative px-3">
                        <div className="float-left w-full mx-0">
                          <div className="float-left w-[50%] relative">
                            <h2 className="inline-block text-[#2490da]">
                              {idx + 1}.{" "}
                              <Link
                                href={`/tv/${rate?.item?.id}`}
                                className="font-bold"
                              >
                                {rate.item?.title || rate.item?.name}
                              </Link>
                              <div
                                onClick={() => {
                                  setModal(!modal),
                                    setSelectedItemId(rate.item.id);
                                }}
                                className="inline-block min-w-[32px] bg-white dark:bg-[#242424] border-[1px] border-[#00000011] dark:border-[#292929] hover:bg-[#9e9e9e33] px-2 py-[2px] ml-2 -mb-1 leading-3 rounded-md cursor-pointer"
                              >
                                <span>
                                  {rate?.rating?.rating === 0 ? (
                                    <IoMdAdd className="hover:text-opacity-70 dark:hover:backdrop-brightness-75 transform duration-300" />
                                  ) : (
                                    <CiEdit className="hover:text-opacity-70 dark:hover:backdrop-brightness-75 transform duration-300" />
                                  )}
                                </span>
                              </div>
                            </h2>
                            {modal &&
                              selectedItemId === rate.item.id && ( // Open modal for selected item only
                                <RatingModal
                                  modal={modal}
                                  setModal={setModal}
                                  id={rate.item?.id.toString()}
                                  user={user}
                                  tv={rate?.item?.id.toString()} // Pass the item id as a string
                                  userRating={matchedIds}
                                  tvName={rate?.item?.name || rate?.item?.title}
                                  tvItems={rate?.item}
                                />
                              )}

                            <p className="text-sm text-[#818a91] opacity-60 mb-5">
                              {rate.item?.first_air_date},{" "}
                              <span>
                                {rate.item?.number_of_episodes} Episodes
                              </span>
                            </p>
                          </div>
                          <div
                            className={`float-left w-[33.33333%] text-center md:text-right relative ${
                              isUserList && "w-[50%] text-end"
                            }`}
                          >
                            <p className="text-center inline-flex items-center">
                              {rate?.rating?.rating > 0 ? (
                                <FaStar className="text-yellow-500" />
                              ) : (
                                <CiStar className="text-yellow-500" />
                              )}{" "}
                              <span className="pl-1">
                                {rate?.rating?.rating}
                              </span>
                            </p>
                          </div>
                          <div
                            className={`float-left w-[16.66667%] text-end relative ${
                              isUserList && "w-[50%]"
                            }`}
                          >
                            {!isUserList && (
                              <p className="text-center inline-flex items-center">
                                {yourRating
                                  .filter(
                                    (item: any) =>
                                      item.tvId === rate?.item?.id.toString()
                                  )
                                  .map((item: any) => item.rating).length >
                                0 ? (
                                  <FaStar className="text-yellow-500" />
                                ) : (
                                  <CiStar className="text-yellow-500" />
                                )}{" "}
                                <span className="pl-1">
                                  {yourRating
                                    .filter(
                                      (item: any) =>
                                        item.tvId === rate?.item?.id.toString()
                                    )
                                    .map((item: any) => item.rating).length > 0
                                    ? yourRating
                                        .filter(
                                          (item: any) =>
                                            item.tvId ===
                                            rate?.item?.id.toString()
                                        )
                                        .map((item: any) => item.rating)
                                    : 0}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="inline-block">
                          <p>
                            {list?.dramaComment
                              ?.filter((item) => item?.tvId === rate?.item?.id)
                              ?.map((com) => com?.comment)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
