"use client";

import { friendItems } from "@/helper/item-list";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
import { useProfileData } from "@/hooks/useProfileData";
import { useUserFriendData } from "@/hooks/useUserFriendData";
import FriendList from "./FriendList";

interface FriendProps {
  name: string;
}

const Friend: React.FC<FriendProps> = ({ name }) => {
  const { data } = useProfileData(name);
  const { user, currentUser, friend } = { ...data };
  const { data: userFriends } = useUserFriendData(user?.id as string);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isDeleted, setIsDeleted] = useState<Set<string>>(new Set());

  const {
    data: searchResults,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user_friends", searchTerm, user?.id],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return { users: [] };
      const response = await fetch(
        `/api/friend/addFriend?friQ=${encodeURIComponent(searchTerm)}&userId=${
          user?.id
        }`,
        {
          headers: {
            "Cache-Control": "max-age=300",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }
      return await response.json();
    },
    enabled: !!user?.id && searchTerm.length >= 2,
    staleTime: 0,
    gcTime: 300000,
    retry: false,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value.trim());
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (!value.trim()) {
      setSearchTerm("");
    } else {
      debouncedSearch(value);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  // Get the list of friends to display based on search term and filter out deleted friends
  const displayFriends =
    searchTerm.length >= 2 ? searchResults?.users : userFriends || [];

  const uniqueFriends = Array.from(
    new Map(
      displayFriends
        ?.filter((friend: any) => !isDeleted.has(friend.friendId))
        .map((friend: any) => [friend.friendId, friend])
    ).values()
  );
  const hasFriends = uniqueFriends.length > 0;

  const deleteFriend = async (friendId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendRequestId: friendId,
          friendRespondId: currentUser?.id,
          bothRecords: true, // Add this flag to indicate both records should be deleted
        }),
      });

      if (response.ok) {
        // Only update UI after successful server response
        setIsDeleted((prev) => new Set([...prev, friendId]));
        setModal(false);
        setSelectedFriendId(null);
        await refetch();
        router.refresh();
        toast.success("Friend removed successfully");
      } else {
        toast.error("Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("An error occurred while removing friend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 h-screen">
      <div className="bg-white dark:bg-[#242526] h-[500px] border-2 border-[#d3d3d38c] dark:border-[#00000024] shadow-md border-sm rounded-md">
        <h1 className="text-2xl font-bold px-5 pt-4">Friends</h1>
        <FriendList
          user={user}
          currentUser={currentUser}
          allFriendsCount={uniqueFriends?.length || 0}
          friendRequestCount={
            friend?.filter(
              (f) =>
                f.status === "pending" &&
                f?.friendRequestId !== currentUser?.id &&
                f?.friendRespondId === currentUser?.id
            )?.length || 0
          }
        />

        <div className="px-4 py-5">
          <label htmlFor="search" className="text-md font-normal">
            Search for your friends
          </label>
          <div className="relative mb-4 flex w-full flex-wrap items-stretch mt-2">
            <input
              type="search"
              name="Friend Search"
              className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-[#46494a] dark:bg-[#3a3b3c] dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-[#2490da]"
              placeholder="Search friends by name or country"
              value={inputValue}
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

        <div className="relative">
          {isLoading ? (
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
              {hasFriends || isDeleted ? (
                uniqueFriends.map((friend: any) => (
                  <div key={friend.id} className="mb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <Image
                          src={
                            friend.profileAvatar ||
                            friend.image ||
                            "/default-pf.webp"
                          }
                          alt={`${friend.name}'s Profile`}
                          width={200}
                          height={200}
                          quality={100}
                          className="w-[50px] h-[50px] bg-center bg-cover object-cover rounded-full"
                          priority
                        />
                        <div className="pl-3">
                          <Link
                            prefetch={false}
                            href={`/profile/${friend.name}`}
                            className="text-[#2490da] font-bold"
                          >
                            {friend.name}
                          </Link>
                          <p>{friend.country}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                          onClick={() => {
                            setSelectedFriendId(friend.friendId);
                            setModal(!modal);
                          }}
                        >
                          <span className="relative flex items-center">
                            <FaCheck className="mr-2 mt-[2px]" />
                            <span className="pt-[2px]">Friends</span>
                            <IoIosArrowDown className="ml-1 mt-[2px]" />
                          </span>
                          {modal && selectedFriendId === friend.friendId && (
                            <span
                              className="absolute top-[50px] right-6 dark:bg-[#3a3b3c] dark:bg-opacity-50 rounded-md px-5 md:px-6 py-2"
                              onClick={() => deleteFriend(friend.friendId)}
                            >
                              <p>
                                {!loading ? (
                                  "Unfriend"
                                ) : (
                                  <ClipLoader
                                    loading={loading}
                                    color="#c3c3c3"
                                    size={14}
                                  />
                                )}
                              </p>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center">
                  {searchTerm.length >= 2
                    ? "No friends found matching your search"
                    : searchTerm.length > 0
                    ? "Type at least 2 characters to search"
                    : `${
                        user?.displayName || user?.name
                      } does not have any friends yet.`}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friend;
