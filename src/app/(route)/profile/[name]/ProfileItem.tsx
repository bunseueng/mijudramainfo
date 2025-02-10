"use client";

import { profileList } from "@/helper/item-list";
import Color from "@tiptap/extension-color";
import CoverPhoto from "./CoverPhoto";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { lazy, useEffect, useState } from "react";
import ImageResize from "tiptap-extension-resize-image";
import Links from "next/link";
import { usePathname } from "next/navigation";
import { FaCheck, FaList, FaUserCheck } from "react-icons/fa6";
import { IoPersonAddSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { IoIosArrowDown } from "react-icons/io";
import {
  CommentProps,
  currentUserProps,
  FriendRequestProps,
  ITvReview,
  List,
  ProfileFeedsTypes,
  UserProps,
} from "@/helper/type";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Users } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useProfileData } from "@/hooks/useProfileData";
import { useUserFriendData } from "@/hooks/useUserFriendData";
import { useQueryClient } from "@tanstack/react-query";

const RecentLists = lazy(() => import("./lists/RecentLists"));
const Watchlist = lazy(() => import("./watchlist/Watchlist"));
const ProfileList = lazy(() => import("./lists/ProfileList"));
const ProfileReviews = lazy(() => import("./reviews/ProfileReviews"));
const Feeds = lazy(() => import("./feeds/Feeds"));
const FollowButton = dynamic(
  () => import("@/app/component/ui/Button/FollowButton"),
  { ssr: false }
);
const AcceptRejectButton = dynamic(
  () => import("@/app/component/ui/Button/AcceptRejectButton"),
  { ssr: false }
);

const DEFAULT_PROFILE_IMAGE = "/default-pf.webp";

export interface User {
  user: UserProps;
  users: UserProps[];
}

type ProfileItemType = {
  name: string;
};

const ProfileItem: React.FC<ProfileItemType> = ({ name }) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data, refetch: refetchProfileData } = useProfileData(name);
  const { data: friend, refetch: refetchFriendData } = useUserFriendData(
    data?.user?.id as string
  );
  const [editable, setEditable] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [friRequestModal, setFriRequestModal] = useState<boolean>(false);
  const [friendRequests, setFriendRequests] = useState(data?.friend);
  const [followerLength, setFollowerLength] = useState<number>(0);

  useEffect(() => {
    if (data?.user?.followers) {
      setFollowerLength(data.user.followers.length);
    }
  }, [data?.user?.followers]);

  useEffect(() => {
    setFriendRequests(data?.friend);
  }, [data?.friend]);

  const handleFollowerUpdate = (count: number) => {
    setFollowerLength(count);
  };

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    content: data?.user?.biography,
    extensions: [
      StarterKit.configure({
        dropcursor: false,
      }),
      Underline.configure({
        HTMLAttributes: { class: "text-xl font-bold", levels: [2] },
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Link.extend({ inclusive: false }).configure({
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ImageResize.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: { class: "ds flex", levels: [2] },
      }),
      Dropcursor,
    ],
  });

  const getUserImage = (user: UserProps | null | undefined) => {
    if (!user) return DEFAULT_PROFILE_IMAGE;
    return user.profileAvatar || user.image || DEFAULT_PROFILE_IMAGE;
  };

  const updateFriendCache = (newFriend: any) => {
    // Update profile data cache
    queryClient.setQueryData(["profile_data", name], (oldData: any) => ({
      ...oldData,
      friends: oldData?.friends ? [...oldData.friends, newFriend] : [newFriend],
    }));

    // Update friend data cache
    queryClient.setQueryData(
      ["user_friend_data", data?.user?.id],
      (oldData: any) => {
        const newFriendData = {
          friendId: newFriend.friendRequestId,
          name: newFriend.name,
          profileAvatar: newFriend.profileAvatar,
          image: newFriend.image,
        };
        return oldData ? [...oldData, newFriendData] : [newFriendData];
      }
    );
  };

  const removeFriendFromCache = (friendRequestId: string) => {
    // Update profile data cache
    queryClient.setQueryData(["profile_data", name], (oldData: any) => ({
      ...oldData,
      friends: oldData?.friends?.filter(
        (f: any) =>
          f.friendRequestId !== friendRequestId &&
          f.friendRespondId !== friendRequestId
      ),
    }));

    // Update friend data cache
    queryClient.setQueryData(
      ["user_friend_data", data?.user?.id],
      (oldData: any) =>
        oldData?.filter((f: any) => f.friendId !== friendRequestId)
    );
  };

  const sendFriendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data?.user?.id || !data?.currentUser?.id) {
      toast.error("Unable to send friend request at this time");
      return;
    }

    setLoading(true);

    const newFriendRequest = {
      friendRespondId: data.user.id,
      friendRequestId: data.currentUser.id,
      profileAvatar: data.currentUser.profileAvatar,
      image: data.currentUser.image,
      name: data.currentUser.name,
      country: data.currentUser.country,
      status: "pending",
      actionDatetime: new Date(),
    };

    // Optimistically update cache
    updateFriendCache(newFriendRequest);

    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFriendRequest),
      });

      if (response.ok) {
        // Refetch data to ensure consistency
        await Promise.all([refetchProfileData(), refetchFriendData()]);
        toast.success("Friend request sent!");
      } else {
        // Revert optimistic update
        removeFriendFromCache(data.currentUser.id);
        toast.error("Failed to send friend request");
      }
    } catch (error) {
      // Revert optimistic update
      removeFriendFromCache(data.currentUser.id);
      toast.error("An error occurred while sending friend request");
    } finally {
      setLoading(false);
    }
  };

  const deleteFriend = async (
    friendRequestId: string,
    currentUserId: string
  ) => {
    if (!friendRequestId) {
      toast.error("Invalid friend request");
      return;
    }

    setLoading(true);

    // Store current cache state
    const previousProfileData = queryClient.getQueryData([
      "profile_data",
      name,
    ]);
    const previousFriendData = queryClient.getQueryData([
      "user_friend_data",
      data?.user?.id,
    ]);

    // Optimistically remove friend from cache
    removeFriendFromCache(friendRequestId);

    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendRequestId, currentUserId }),
      });

      if (response.ok) {
        // Refetch data to ensure consistency
        await Promise.all([refetchProfileData(), refetchFriendData()]);
        setModal(false);
        toast.success("Friend removed successfully");
      } else {
        // Revert cache to previous state
        queryClient.setQueryData(["profile_data", name], previousProfileData);
        queryClient.setQueryData(
          ["user_friend_data", data?.user?.id],
          previousFriendData
        );
        toast.error("Failed to remove friend");
      }
    } catch (error) {
      // Revert cache to previous state
      queryClient.setQueryData(["profile_data", name], previousProfileData);
      queryClient.setQueryData(
        ["user_friend_data", data?.user?.id],
        previousFriendData
      );
      console.error("Error removing friend:", error);
      toast.error("An error occurred while removing friend");
    } finally {
      setLoading(false);
    }
  };

  const isPendingOrRejected = data?.friends?.some(
    (item: FriendRequestProps) =>
      item?.status === "pending" || item?.status === "rejected"
  );

  const friendRequestId = data?.friends?.find(
    (item: FriendRequestProps) => item?.friendRequestId
  );

  const currentUserFriends = data?.friends?.find(
    (friendItem: FriendRequestProps) =>
      (friendItem.friendRequestId === data?.currentUser?.id ||
        friendItem.friendRespondId === data?.currentUser?.id) &&
      friendItem.status === "accepted"
  );

  const currentFriendStatus = data?.friends?.find(
    (fri: FriendRequestProps) =>
      (fri.friendRequestId === data?.currentUser?.id ||
        fri.friendRespondId === data?.currentUser?.id) &&
      (fri.friendRequestId === data?.user?.id ||
        fri.friendRespondId === data?.user?.id)
  )?.status;

  const uniqueFriends = Array.from(
    new Map(friend?.map((friend) => [friend.friendId, friend])).values()
  );

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!isMounted || !editor) return null;

  return (
    <div className="max-w-6xl w-full mx-auto py-3 md:px-6">
      <div className="flex flex-col md:block md:-mx-3">
        <div className="order-2 float-left w-full md:w-[33.33333%] relative px-3 mb-10">
          <div className="block">
            {/* Profile Card */}
            <div className="relative bg-[#fff] dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#00000024] rounded-md shadow-sm mb-3">
              <div className="text-center px-3 py-2">
                <div className="text-center mb-4">
                  <Image
                    src={getUserImage(data?.user)}
                    alt={`${
                      data?.user?.displayName || data?.user?.name || "User"
                    }'s Profile`}
                    width={980}
                    height={980}
                    quality={100}
                    className="w-full align-middle"
                    priority
                  />
                </div>
                <Links
                  href={`/profile/${data?.user?.name}/lists`}
                  className="block w-full text-black dark:text-[#ffffffde] text-md bg-[#fff] dark:bg-[#3a3b3c] border border-[#d3d3d38c] dark:border-[#3e4042] px-5 py-3 shadow-sm"
                >
                  <span className="flex items-center justify-center">
                    <FaList className="mr-2" />
                    <span className="pt-[2px]">
                      {data?.user?.displayName || data?.user?.name || "User"}
                      &apos;s List
                    </span>
                  </span>
                </Links>
                <div className="flex justify-around text-md mt-3 p-4 md:p-2 lg:p-4">
                  <div className="min-[56px]">
                    <Links href="" className="block">
                      <span>{data?.user?.following?.length ?? 0}</span>
                      <span className="block text-[#818a91] md:text-sm lg:text-md">
                        Following
                      </span>
                    </Links>
                  </div>
                  <div className="min-[56px]">
                    <Links href="" className="block">
                      <span>{followerLength}</span>
                      <span className="block text-[#818a91] md:text-sm lg:text-md">
                        Followers
                      </span>
                    </Links>
                  </div>
                  <div className="min-[56px]">
                    <Links href="" className="block">
                      <span>{uniqueFriends?.length}</span>
                      <span className="block text-[#818a91] md:text-sm lg:text-md">
                        Friends
                      </span>
                    </Links>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="block relative bg-[#fff] dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="bg-[#1675b6] text-[#ffffffde] relative px-3 py-2">
                <h3>Details</h3>
              </div>
              <div className="bg-white dark:bg-[#1b1c1d] px-3 py-2">
                <ul className="rounded-sm">
                  <li className="block relative p-0">
                    <Users className="inline-block mr-1" size={14} />
                    <b className="inline-block text-sm font-semibold">
                      Last Online:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {data?.lastLogin ?? "Unknown"}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <span className="inline-block mr-1">⚥</span>
                    <b className="inline-block text-sm font-semibold">
                      Gender:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {data?.user?.gender
                          ? data.user.gender.charAt(0).toUpperCase() +
                            data.user.gender.slice(1)
                          : "Not specified"}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <MapPin className="inline-block mr-1" size={14} />
                    <b className="inline-block text-sm font-semibold">
                      Location:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {data?.user?.country ?? "Unknown"}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <span className="inline-block mr-1">🎭</span>
                    <b className="inline-block text-sm font-semibold">
                      Roles:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {data?.user?.role === "USER"
                          ? "Member"
                          : data?.user?.role ?? "Member"}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <CalendarDays className="inline-block mr-1" size={14} />
                    <b className="inline-block text-sm font-semibold">
                      Join Date:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {data?.formattedDate ?? "Unknown"}
                      </span>
                    </b>
                  </li>
                </ul>
              </div>
            </div>

            {/* Friends Section */}
            <div className="block relative bg-[#fff] dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="bg-[#1675b6] text-[#ffffffde] relative px-3 py-2">
                <h3>Friends</h3>
              </div>
              <div className="absolute top-2 right-4">
                <Links
                  prefetch={false}
                  href={`/friends/${data?.user?.name}`}
                  className="text-white"
                >
                  View all
                </Links>
              </div>
              <div className="border-b border-b-[#78828c21] m-0"></div>
              <div className="text-center px-3 py-2">
                {uniqueFriends.length > 0 ? (
                  uniqueFriends.map((fri) => {
                    return (
                      <Links
                        key={fri.id}
                        href={`/profile/${fri.name}`}
                        className="inline-block"
                      >
                        <div className="relative group">
                          <Image
                            src={
                              fri.profileAvatar ||
                              fri.image ||
                              DEFAULT_PROFILE_IMAGE
                            }
                            alt={fri.name || "Friend"}
                            width={200}
                            height={200}
                            quality={100}
                            priority
                            className="w-[40px] h-[40px] bg-center bg-cover object-cover align-middle rounded-full"
                          />
                          <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                            {fri.name}
                          </div>
                        </div>
                      </Links>
                    );
                  })
                ) : (
                  <div className="w-full text-center">
                    {data?.user?.displayName || data?.user?.name || "User"} does
                    not have any friends yet.
                  </div>
                )}
              </div>
            </div>

            {/* Recent Lists Section */}
            <div className="block relative bg-[#fff] dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="bg-[#1675b6] text-[#ffffffde] relative px-3 py-2">
                <h3>Recent Lists</h3>
              </div>
              <div className="bg-white dark:bg-[#1b1c1d] px-3 py-2">
                {data?.formattedLists?.length ? (
                  <RecentLists
                    list={data.formattedLists}
                    movieId={data?.movie_id}
                    tvId={data?.tv_id}
                  />
                ) : (
                  <div>
                    {data?.user?.displayName || data?.user?.name || "User"} does
                    not have any lists yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="order-1 float-left w-full md:w-[66.66667%] relative px-3 mb-10">
          <CoverPhoto user={data?.user} currentUser={data?.currentUser} />
          <div className="inline-block w-full h-full bg-[#fff] dark:bg-[#242526] relative border border-[#d3d3d38c] dark:border-[#00000024] rounded-md shadow-sm mb-3">
            <div className="inline-block w-full h-full relative mt-5 md:mt-2">
              {/* Profile Header */}
              <div className="float-left relative px-3 mb-2">
                <div className="md:hidden">
                  <div className="float-left w-[16.66667%] relative">
                    <div className="w-[64px] h-[64px] inline-block relative whitespace-nowrap rounded-full mb-3">
                      <Image
                        src={getUserImage(data?.user)}
                        alt={`${
                          data?.user?.displayName || data?.user?.name || "User"
                        }'s Profile`}
                        width={200}
                        height={200}
                        quality={100}
                        priority
                        className="w-full h-full align-middle rounded-full bg-center bg-cover object-cover"
                      />
                    </div>
                  </div>
                  <div className="float-left w-[66.66667%] relative ml-8 md:ml-5 text-start md:text-end">
                    <h1 className="text-xl font-bold mb-2">
                      {data?.user?.displayName || data?.user?.name || "User"}
                    </h1>
                    <span>{data?.user?.country}</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold pt-2 mb-2">
                    {data?.user?.displayName || data?.user?.name || "User"}
                  </h1>
                  <span>{data?.user?.country}</span>
                </div>
              </div>

              {/* Friend Actions */}
              {data?.currentUser?.id !== data?.user?.id && (
                <div className="flex items-center justify-end mr-5">
                  {!isPendingOrRejected &&
                    currentUserFriends &&
                    (currentUserFriends.friendRespondId === data?.user?.id ||
                      currentUserFriends.friendRequestId ===
                        data?.user?.id) && (
                      <button
                        className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                        onClick={() => setModal(!modal)}
                      >
                        <span className="relative flex items-center">
                          <FaCheck className="mr-2 mt-[2px]" />
                          <span className="pt-[2px]">Friends</span>
                          <IoIosArrowDown className="ml-1 mt-[2px]" />
                        </span>
                        {modal && (
                          <span
                            className="absolute top-[50px] right-[75px] md:right-[83px] dark:bg-[#3a3b3c] dark:bg-opacity-50 rounded-md px-5 md:px-6 py-2"
                            onClick={() =>
                              deleteFriend(
                                friendRequestId?.friendRequestId?.toString() ??
                                  "",
                                data?.currentUser?.id ?? ""
                              )
                            }
                          >
                            <p>Unfriend</p>
                          </span>
                        )}
                      </button>
                    )}

                  {data?.friends?.find(
                    (fri: FriendRequestProps) =>
                      data?.currentUser?.id === fri?.friendRequestId
                  )?.status === "pending" && (
                    <button
                      type="button"
                      name="friend button"
                      className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                      onClick={() => setFriRequestModal(!friRequestModal)}
                    >
                      <span className="flex items-center">
                        {data?.findFriendId ? (
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
                        <span className="tex-xs md:text-sm pt-[2px]">
                          Friend Request Sent
                        </span>
                      </span>
                      {friRequestModal && (
                        <span
                          className="text-xs md:text-sm absolute top-[40px] md:top-[50px] right-[89px] md:right-[97px] dark:bg-[#3a3b3c] dark:bg-opacity-50 rounded-md px-5 md:px-6 py-2"
                          onClick={() =>
                            deleteFriend(
                              data?.currentUser?.id ?? "",
                              data?.currentUser?.id ?? ""
                            )
                          }
                        >
                          <p>Cancel Request</p>
                        </span>
                      )}
                    </button>
                  )}

                  {currentFriendStatus !== "pending" &&
                    currentFriendStatus !== "accepted" && (
                      <button
                        name="Add friend button"
                        className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                        onClick={sendFriendRequest}
                      >
                        <span className="flex items-center">
                          {data?.findFriendId ? (
                            <FaUserCheck className="mr-2" />
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
                    )}

                  {data?.friends &&
                    data?.friends?.filter(
                      (fri: FriendRequestProps) =>
                        data?.currentUser?.id === fri?.friendRespondId
                    )?.length > 0 &&
                    data?.friends
                      ?.filter(
                        (item: FriendRequestProps) => item?.status === "pending"
                      )
                      .map((item: FriendRequestProps, idx: number) => (
                        <div key={idx} className="mr-3">
                          <AcceptRejectButton
                            setFriendRequests={setFriendRequests}
                            item={item}
                            onActionComplete={() => {
                              refetchProfileData();
                              refetchFriendData();
                            }}
                          />
                        </div>
                      ))}

                  <FollowButton
                    user={data?.user as UserProps}
                    currentUser={data?.currentUser as currentUserProps | null}
                    onFollowerUpdate={handleFollowerUpdate}
                  />
                </div>
              )}

              {/* Profile Navigation */}
              <Tabs className="inline-block w-full h-full border-b border-b-[#78828c21] -my-4 mt-4">
                {profileList?.map((list: any, idx: number) => (
                  <TabsList
                    key={idx}
                    id={list.id}
                    className={`float-left -mb-1 my-1 cursor-pointer ${
                      pathname === `/profile/${data?.user?.name}${list.page}`
                        ? "bg-white rounded-md"
                        : ""
                    }`}
                  >
                    <TabsTrigger value={list?.label}>
                      <Links
                        prefetch={false}
                        href={`${list.link}/${data?.user?.name}/${list.page}`}
                        className="relative text-xs md:text-sm font-bold px-4 py-2"
                      >
                        {list?.label}
                      </Links>
                    </TabsTrigger>
                  </TabsList>
                ))}
              </Tabs>
            </div>

            {/* Profile Content */}
            <div className="px-1 md:px-4 py-2">
              {pathname === `/profile/${data?.user?.name}` && (
                <div className="mt-5">
                  {data?.user?.biography === null ? (
                    <p className="p-4">
                      This profile does not have biography yet
                    </p>
                  ) : (
                    <div className="bg-white dark:bg-[#242424] border border-[#00000024] dark:border-[#272727] md:p-4">
                      <EditorContent editor={editor} />
                    </div>
                  )}
                </div>
              )}

              {pathname === `/profile/${data?.user?.name}/watchlist` && (
                <Watchlist
                  tv_id={
                    data?.tv_id as
                      | { id: number; updatedAt: Date }
                      | { id: number; updatedAt: Date }[]
                  }
                  existedFavorite={data?.existedFavorite}
                  user={data?.user as UserProps}
                  list={data?.formattedLists as List[] | []}
                  movieId={
                    data?.movie_id as
                      | { id: number; updatedAt: Date }
                      | { id: number; updatedAt: Date }[]
                  }
                />
              )}

              {pathname === `/profile/${data?.user?.name}/lists` && (
                <ProfileList list={data?.formattedLists as List[] | []} />
              )}

              {pathname === `/profile/${data?.user?.name}/feeds` && (
                <Feeds
                  user={data?.user as UserProps}
                  users={data?.users as UserProps[]}
                  currentUser={data?.currentUser as currentUserProps}
                  getFeeds={data?.getFeeds as ProfileFeedsTypes[] | []}
                  getComment={data?.getComment as CommentProps[]}
                />
              )}

              {pathname === `/profile/${data?.user?.name}/reviews` && (
                <ProfileReviews
                  getReview={data?.formattedReviews as ITvReview[]}
                  currentUser={data?.currentUser as currentUserProps}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileItem;
