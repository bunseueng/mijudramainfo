"use client";

import { friendItems } from "@/helper/item-list";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoPersonAddSharp, IoSearch } from "react-icons/io5";
import Image from "next/image";
import { FaUserCheck } from "react-icons/fa6";
import {
  currentUserProps,
  IFriend,
  ProfilePageProps,
  SearchParamsType,
  UserProps,
} from "@/helper/type";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import RingLoader from "react-spinners/RingLoader";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { MdOutlineGroupAdd } from "react-icons/md";
interface currentUser {
  currentUser: currentUserProps | null;
  user: UserProps | null;
  users: UserProps[] | null;
}

const UserSearch: React.FC<IFriend & currentUser & ProfilePageProps> = ({
  user,
  users,
  friend,
  currentUser,
  findFriendId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get("friQ");
  const inputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const {
    data: friends,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["friends", query], // Add user ID to the key for refetching
    queryFn: async () => {
      const response = await fetch(`/api/user?friQ=${query || ""}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }
      return await response.json();
    },
  });

  const updateURLParams = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    if (value) {
      params.set("friQ", value);
    } else {
      params.delete("friQ");
    }
    router.push(`${pathname}/?${params.toString()}`, { scroll: false });
  }, 300);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    updateURLParams(value); // Only update the URL with debounced callback
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const sendFriendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Add this line
    setLoading(true);
    const findUserId = friends?.users?.find((user: UserProps) => user?.id);
    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendRespondId: findUserId?.id,
          friendRequestId: currentUser?.id,
          profileAvatar: currentUser?.profileAvatar,
          image: currentUser?.image,
          name: currentUser?.name,
          country: currentUser?.country,
          actionDatetime: new Date(),
        }),
      });
      if (response.ok) {
        router.refresh();
        toast.success("Friend request sent!");
      } else {
        toast.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (query) {
      refetch(); // Refetch data when the query changes
    }
  }, [query, refetch]);

  return (
    <div className="max-w-4xl mx-auto my-10 h-screen">
      <div className="bg-white dark:bg-[#242526] h-[500px] border-2 border-[#d3d3d38c] dark:border-[#00000024] shadow-md border-sm rounded-md">
        <h1 className="text-2xl font-bold px-5 pt-4">Friends</h1>
        <ul className="inline-block w-full border-b-2 border-b-[#78828c21] -my-4 pb-1 mt-4">
          {friendItems
            ?.filter((item) => {
              // Conditionally hide "Friend Request" and "User Search" when users don't match
              if (
                (item.label === "Friend Request" ||
                  item.label === "User Search") &&
                currentUser?.name !== user?.name
              ) {
                return false; // Hide these items
              }
              return true; // Show all other items
            })
            ?.map((list: any, idx: number) => {
              // Determine the href based on the label
              let linkPath = `${list?.link}/${user?.name}`;
              if (list?.label === "Friend Request") {
                linkPath = `${list?.link}/${user?.name}/request`;
              } else if (list?.label === "User Search") {
                linkPath = `${list?.link}/${user?.name}/search`;
              }

              // Determine if the current path matches the link
              const isActive = pathname === linkPath;

              return (
                <li
                  key={idx}
                  id={list.id}
                  className={`float-left -mb-1 cursor-pointer hover:border-b-[1px] hover:border-b-[#3f3f3f] hover:pb-[5px] ${
                    isActive ? "border-b border-b-[#1d9bf0] pb-1" : ""
                  }`}
                >
                  <Link
                    href={linkPath}
                    className="relative text-sm md:text-md font-semibold px-2 md:px-4 py-2"
                  >
                    {list?.label}
                  </Link>
                </li>
              );
            })}
        </ul>

        <div className="px-4 py-5">
          <label htmlFor="search" className="text-md font-normal">
            Search for your friends
          </label>
          <div className="relative mb-4 flex w-full flex-wrap items-stretch mt-2">
            <input
              type="search"
              name="Friend Search"
              className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-[#46494a] dark:bg-[#3a3b3c] dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-[#2490da]"
              placeholder="Search"
              value={search}
              onChange={handleInputChange}
              ref={inputRef}
            />

            {/* <!--Search button--> */}
            <button
              name="Search Button"
              className="relative z-[2] flex items-center rounded-r bg-primary px-5 py-[0.25rem] text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg dark:bg-[#3a3b3c] border-2 dark:border-[#3e4042]"
            >
              <IoSearch size={17} />
            </button>
          </div>
        </div>
        <div className="relative">
          {isLoading ? (
            <div className="absolute right-0 left-0 top-0 flex items-center justify-center">
              {/* Use absolute inset-0 for full coverage */}
              <RingLoader color="#36d7b7" />
            </div>
          ) : (
            <div className="px-4 pb-5">
              {friends?.users?.length !== 0 ? (
                friends?.users?.map((user: UserProps) => (
                  <div
                    key={user?.id}
                    className="relative float-left w-full md:w-[50%] px-2.5 mb-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <Link href={`/profile/${user?.name}`}>
                          <Image
                            src={user?.profileAvatar || (user?.image as any)}
                            alt={`${user?.displayName || user?.name}'s Profile`}
                            width={200}
                            height={200}
                            quality={100}
                            className="w-[50px] h-[50px] bg-center bg-cover object-cover rounded-full"
                            priority
                          />
                        </Link>
                        <div className="pl-3">
                          <Link href={`/profile/${user?.name}`}>
                            <h1 className="text-[#2490da] font-bold">
                              {user?.name}
                            </h1>
                          </Link>
                          <p>{user?.country}</p>
                        </div>
                      </div>{" "}
                      {friend?.find((fri) => user?.id === fri?.friendRespondId)
                        ?.status === "pending" && (
                        <button
                          name="friend button"
                          className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                        >
                          <span className="flex items-center">
                            {findFriendId ? (
                              <FaUserCheck className="mr-2" />
                            ) : (
                              <>
                                {loading ? (
                                  <ClipLoader
                                    color="#272727"
                                    size={20}
                                    loading={loading}
                                    className="mr-1"
                                  />
                                ) : (
                                  <IoPersonAddSharp className="mr-2" />
                                )}
                              </>
                            )}
                            <span className="pt-[2px]">
                              Friend Request Sent
                            </span>
                          </span>
                        </button>
                      )}
                      {friend?.filter(
                        (fri) => user?.id === fri?.friendRespondId
                      )?.length >
                        0 ===
                      false ? (
                        <button
                          name="Add friend button"
                          className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                          onClick={sendFriendRequest}
                        >
                          <span className="flex items-center">
                            {findFriendId ? (
                              <MdOutlineGroupAdd className="mr-2" />
                            ) : (
                              <>
                                {loading ? (
                                  <ClipLoader
                                    color="#fff"
                                    size={20}
                                    loading={loading}
                                    className="mr-1"
                                  />
                                ) : (
                                  <IoPersonAddSharp className="mr-2" />
                                )}
                              </>
                            )}
                            <span className="pt-[2px]">Add Friend</span>
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center">User not found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
