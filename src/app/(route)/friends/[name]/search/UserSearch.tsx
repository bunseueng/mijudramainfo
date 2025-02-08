"use client";

import { friendItems } from "@/helper/item-list";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoPersonAddSharp, IoSearch } from "react-icons/io5";
import Image from "next/image";
import { FaUserCheck } from "react-icons/fa6";
import { UserProps } from "@/helper/type";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { useProfileData } from "@/hooks/useProfileData";
import FriendList from "../FriendList";
import { getPendingFriendRequests, getUniqueFriends } from "@/lib/friendUtils";
import { useUserFriendData } from "@/hooks/useUserFriendData";

interface ProfileSearchProps {
  name: string;
}

const UserSearch: React.FC<ProfileSearchProps> = ({ name }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(
    new Set()
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data } = useProfileData(name);
  const { user, friends, currentUser } = { ...data };
  const { data: userFriends } = useUserFriendData(user?.id as string);
  // Get unique friends list
  const uniqueFriends = getUniqueFriends(userFriends || []);
  const pendingFriendRequests = getPendingFriendRequests(
    friends,
    currentUser?.id as string
  );

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `/api/friend/search?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            "Cache-Control": "max-age=300",
          },
        }
      );
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: Boolean(searchTerm && searchTerm.length >= 2), // More explicit condition
    staleTime: 0,
    gcTime: 300000,
    retry: false,
    initialData: { users: [] },
  });

  // Simplified debounced search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setSearchTerm(""); // Immediately clear search results
    } else {
      debouncedSearch(value.trim());
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendFriendRequest = async (
    e: React.MouseEvent<HTMLButtonElement>,
    friendId: string
  ) => {
    e.preventDefault();
    setLoadingStates((prev) => ({ ...prev, [friendId]: true }));

    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendRespondId: friendId,
          friendRequestId: currentUser?.id,
          profileAvatar: currentUser?.profileAvatar,
          image: currentUser?.image,
          name: currentUser?.name,
          country: currentUser?.country,
          actionDatetime: new Date(),
        }),
      });
      if (response.ok) {
        setPendingRequests((prev) => new Set([...prev, friendId]));
        toast.success("Friend request sent!");
      } else {
        toast.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  // Helper function to check if a user has a pending request
  const hasPendingRequest = (userId: string) => {
    return (
      pendingRequests.has(userId) ||
      friends?.find((fri) => userId === fri?.friendRespondId)?.status ===
        "pending"
    );
  };
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="bg-white dark:bg-[#242526] h-screen border-2 border-[#d3d3d38c] dark:border-[#00000024] shadow-md border-sm rounded-md">
        <h1 className="text-2xl font-bold px-5 pt-4">Friends</h1>
        <FriendList
          user={user}
          currentUser={currentUser}
          allFriendsCount={uniqueFriends?.length || 0}
          friendRequestCount={pendingFriendRequests?.length || 0}
        />

        <div className="px-4 py-5">
          <label htmlFor="search" className="text-md font-normal">
            Search for your friends
          </label>
          <div className="relative mb-4 flex w-full flex-wrap items-stretch mt-2">
            <input
              type="search"
              name="Friend Search"
              value={inputValue}
              className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-[#46494a] dark:bg-[#3a3b3c] dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-[#2490da]"
              placeholder="Search"
              onChange={handleInputChange}
              ref={inputRef}
            />

            <button
              name="Search Button"
              className="relative z-[2] flex items-center rounded-r bg-primary px-5 py-[0.25rem] text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg dark:bg-[#3a3b3c] border-2 dark:border-[#3e4042]"
            >
              <IoSearch size={17} />
            </button>
          </div>
        </div>
        {inputValue !== "" && (
          <div className="relative">
            {searchLoading ? (
              <div className="flex items-center justify-center">
                <div
                  className="w-[100px] h-[100px] flex items-center justify-center text-primary bg-[url('/ghost-loading.gif')] bg-no-repeat bg-center"
                  style={{
                    transform: "scale(0.60)",
                  }}
                ></div>
              </div>
            ) : (
              <div className="px-4 pb-5">
                {searchResults?.users?.length !== 0 ? (
                  searchResults?.users?.map((user: UserProps) => (
                    <div
                      key={user?.id}
                      className="relative float-left w-full md:w-[50%] px-2.5 mb-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <Link
                            href={`/profile/${user?.name}`}
                            prefetch={false}
                          >
                            <Image
                              src={user?.profileAvatar || (user?.image as any)}
                              alt={
                                `${
                                  user?.displayName || user?.name
                                }'s Profile` || "User Profile"
                              }
                              width={200}
                              height={200}
                              quality={100}
                              className="w-[50px] h-[50px] bg-center bg-cover object-cover rounded-full"
                              priority
                            />
                          </Link>
                          <div className="pl-3">
                            <Link
                              href={`/profile/${user?.name}`}
                              prefetch={false}
                            >
                              <h1 className="text-[#2490da] font-bold">
                                {user?.name}
                              </h1>
                            </Link>
                            <p>{user?.country}</p>
                          </div>
                        </div>
                        {hasPendingRequest(user?.id) ? (
                          <button
                            name="friend button"
                            className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                          >
                            <span className="flex items-center">
                              <FaUserCheck className="mr-2" />
                              <span className="pt-[2px]">
                                Friend Request Sent
                              </span>
                            </span>
                          </button>
                        ) : friends &&
                          friends?.filter(
                            (fri) => user?.id === fri?.friendRespondId
                          )?.length >
                            0 ===
                            false ? (
                          <button
                            name="Add friend button"
                            className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                            onClick={(e) =>
                              sendFriendRequest(e, user?.id as string)
                            }
                          >
                            <span className="flex items-center">
                              {loadingStates[user?.id] ? (
                                <ClipLoader
                                  color="#fff"
                                  size={20}
                                  loading={loadingStates[user?.id]}
                                  className="mr-1"
                                />
                              ) : (
                                <IoPersonAddSharp className="mr-2" />
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
        )}
      </div>
    </div>
  );
};

export default UserSearch;
