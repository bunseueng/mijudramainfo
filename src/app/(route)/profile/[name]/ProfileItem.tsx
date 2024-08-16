"use client";

import { profileList } from "@/helper/item-list";
import Color from "@tiptap/extension-color";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import ImageResize from "tiptap-extension-resize-image";
import Links from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Watchlist from "./watchlist/Watchlist";
import Image from "next/image";
import { FaCheck, FaList, FaUserCheck } from "react-icons/fa6";
import { IoPersonAddSharp } from "react-icons/io5";
import ProfileList from "./lists/ProfileList";
import RecentLists from "./lists/RecentLists";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { IoIosArrowDown } from "react-icons/io";
import {
  IFindSpecificUser,
  IFriend,
  ProfilePageProps,
  UserProps,
} from "@/helper/type";
import FollowButton from "@/app/component/ui/Button/FollowButton";

export interface User {
  user: UserProps | null;
}

const ProfileItem: React.FC<
  ProfilePageProps & IFriend & User & IFindSpecificUser
> = ({
  user,
  currentUser,
  tv_id,
  existedFavorite,
  list,
  tvid,
  movieId,
  formattedDate,
  lastLogin,
  findFriendId,
  friend,
  yourFriend,
}) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortby = searchParams?.get("sortby") ?? "";
  const editor = useEditor({
    editable,
    content: user?.biography,
    extensions: [
      StarterKit,
      Underline.configure({
        HTMLAttributes: { class: "text-xl font-bold", levels: [2] },
      }),
      // BulletList.configure({}),
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

  const sendFriendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Add this line
    setLoading(true);
    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendRespondId: user?.id,
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

  const deleteFriend = async (friendRequestId: string) => {
    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendRequestId: friendRequestId,
        }),
      });
      if (response.ok) {
        router.refresh();
        toast.success("Success");
      } else {
        toast.error("Failed to delete friend");
      }
    } catch (error) {
      console.error("Error delete friend:", error);
    }
  };

  const isPendingOrRejected = friend?.some(
    (item: any) => item?.status === "pending" || item?.status === "rejected"
  );

  const friendRequestId = friend?.find((item) => item?.friendRequestId);

  const currentUserFriends = friend.find(
    (friendItem: any) =>
      (friendItem.friendRequestId === currentUser?.id ||
        friendItem.friendRespondId === currentUser?.id) &&
      friendItem.status === "accepted"
  );

  const yourFriends = yourFriend?.filter(
    (item) => item?.id !== currentUser?.id
  );

  const friends = friend.filter(
    (item) => item.friendRespondId === currentUser?.id
  );

  const combinedFriend = [...friends, ...yourFriends];

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-7xl w-full mx-auto py-3 md:px-6">
      <div className="flex flex-col md:block md:-mx-3">
        <div className="order-2 float-left w-full md:w-[33.33333%] relative px-3">
          <div className="block">
            <div className="relative bg-[#fff] dark:bg-[#242526] border-2 border-[#d3d3d38c] dark:border-[#00000024] rounded-md shadow-sm mb-3">
              <div className="text-center px-3 py-2">
                <div className="text-center mb-4">
                  <Image
                    src={user?.profileAvatar || (user?.image as any)}
                    alt="Profile avatar"
                    width={980}
                    height={980}
                    quality={100}
                    className="w-full align-middle"
                  />
                </div>
                <Links
                  href={`/lists/${list?.map((item) => item?.listId)}`}
                  className="block w-full text-black dark:text-[#ffffffde] text-md bg-[#fff] dark:bg-[#3a3b3c] border-2 border-[#d3d3d38c] dark:border-[#3e4042] px-5 py-3 shadow-sm"
                >
                  <span className="flex items-center justify-center">
                    <FaList className="mr-2" />{" "}
                    <span className="pt-[2px]">
                      {user?.displayName || user?.name}&apos;s List
                    </span>
                  </span>
                </Links>
                <div className="flex justify-around text-md mt-3 p-4 md:p-2 lg:p-4">
                  <div className="min-[56px]">
                    <Links href="" className="block ">
                      <span>{user?.following?.length}</span>
                      <span className="block text-[#818a91] md:text-sm lg:text-md">
                        Following
                      </span>
                    </Links>
                  </div>
                  <div className="min-[56px]">
                    <Links href="" className="block ">
                      <span>{user?.followers?.length}</span>
                      <span className="block text-[#818a91] md:text-sm lg:text-md">
                        Followers
                      </span>
                    </Links>
                  </div>
                  <div className="min-[56px]">
                    <Links href="" className="block ">
                      <span>{combinedFriend?.length}</span>
                      <span className="block text-[#818a91] md:text-sm lg:text-md">
                        Friends
                      </span>
                    </Links>
                  </div>
                </div>
              </div>
            </div>
            <div className="block relative bg-[#fff] dark:bg-[#242526] border-2 border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="bg-[#1675b6] text-[#ffffffde] relative px-3 py-2">
                <h3>Details</h3>
              </div>
              <div className="bg-white dark:bg-[#1b1c1d] px-3 py-2">
                <ul className="rounded-sm">
                  <li className="block relative p-0">
                    <b className="inline-block font-bold">Last Online: </b>
                    <span className="text-sm opacity-90"> {lastLogin}</span>
                  </li>
                  <li className="block relative p-0">
                    <b className="inline-block font-bold">Gender: </b>
                    <span className="text-sm opacity-90">
                      {" "}
                      {user?.gender
                        ? user.gender.charAt(0).toUpperCase() +
                          user.gender.slice(1)
                        : ""}
                    </span>
                  </li>
                  <li className="block relative p-0">
                    <b className="inline-block font-bold">Location: </b>
                    <span className="text-sm opacity-90"> {user?.country}</span>
                  </li>
                  <li className="block relative p-0">
                    <b className="inline-block font-bold">Roles: </b>
                    <span className="text-sm opacity-90">
                      {" "}
                      {user?.role === "USER" && "Member"}
                    </span>
                  </li>
                  <li className="block relative p-0">
                    <b className="inline-block font-bold">Join Date: </b>{" "}
                    <span className="text-sm opacity-90"> {formattedDate}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="block relative bg-[#fff] dark:bg-[#242526] border-2 border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="bg-[#1675b6] text-[#ffffffde] relative px-3 py-2">
                <h3>Recent Lists</h3>
              </div>
              <div className="bg-white dark:bg-[#1b1c1d] px-3 py-2">
                <RecentLists list={list} movieId={movieId} tvId={tvid} />
              </div>
            </div>

            <div className="block relative bg-[#fff] dark:bg-[#242526] border-2 border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="relative px-3 py-2">
                <h3>Friends</h3>
              </div>
              <div className="absolute top-2 right-4">
                <Links href="">View all</Links>
              </div>
              <div className="border-b-2 border-b-[#78828c21] m-0"></div>
              <div className="text-center px-3 py-2">
                <Links
                  href=""
                  className="inline-block relative w-[45px] h-[45px] leading-9 rounded-full whitespace-nowrap"
                >
                  <Image
                    src={user?.profileAvatar || (user?.image as string)}
                    alt="Friend Profile avatar"
                    width={200}
                    height={200}
                    quality={100}
                    className="w-full h-full bg-center bg-cover object-cover align-middle rounded-full"
                  />
                </Links>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 float-left w-full md:w-[66.66667%] relative px-3">
          <div className="inline-block w-full h-full bg-[#fff] dark:bg-[#242526] relative border-2 border-[#d3d3d38c] dark:border-[#00000024] rounded-md shadow-sm mb-3">
            <div className="inline-block w-full h-full relative mt-5 md:mt-2">
              <div className="float-left relative px-3 mb-2">
                <div className="md:hidden">
                  <div className="float-left w-[16.66667%] relative">
                    <div className="w-[64px] h-[64px] inline-block relative whitespace-nowrap rounded-full mb-3">
                      <Image
                        src={user?.profileAvatar || user?.image || ""}
                        alt={`${user?.displayName || user?.name} Avatar`}
                        width={200}
                        height={200}
                        quality={100}
                        className="w-full h-full align-middle rounded-full bg-center bg-cover object-cover"
                      />
                    </div>
                  </div>
                  <div className="float-left w-[66.66667%] relative ml-5 text-end">
                    <h1 className="text-xl font-bold mb-2">
                      {user?.displayName || user?.name}
                    </h1>
                    <span>{user?.country}</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold pt-2 mb-2">
                    {user?.displayName || user?.name}
                  </h1>
                  <span>{user?.country}</span>
                </div>
              </div>

              {currentUser?.id !== user?.id && (
                <div className="flex items-center justify-end mr-5">
                  {!isPendingOrRejected &&
                    currentUserFriends &&
                    (currentUserFriends.friendRespondId === user?.id ||
                      currentUserFriends.friendRequestId === user?.id) && (
                      <button
                        className="bg-[#3a3b3c] text-[#ffffffde] text-sm border-2 border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
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
                                friendRequestId?.friendRequestId?.toString() as string
                              )
                            }
                          >
                            <p>Unfriend</p>
                          </span>
                        )}
                      </button>
                    )}

                  {isPendingOrRejected && (
                    <button className="bg-[#3a3b3c] text-[#ffffffde] text-sm border-2 border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer">
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
                        <span className="pt-[2px]">Friend Request Sent</span>
                      </span>
                    </button>
                  )}
                  {!isPendingOrRejected &&
                    currentUserFriends &&
                    currentUserFriends.friendRespondId !== user?.id &&
                    currentUserFriends.friendRequestId !== user?.id && (
                      <button
                        className="bg-[#3a3b3c] text-[#ffffffde] text-sm border-2 border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                        onClick={sendFriendRequest}
                      >
                        <span className="flex items-center">
                          {findFriendId ? (
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

                  <FollowButton user={user} currentUser={currentUser} />
                </div>
              )}
              <ul className="inline-block w-full h-full border-b-2 border-b-[#78828c21] -my-4 pb-1 mt-4">
                {profileList?.map((list: any, idx: number) => (
                  <li
                    key={idx}
                    id={list.id}
                    className={`float-left -mb-1 cursor-pointer hover:border-b-[1px] hover:border-b-[#3f3f3f] hover:pb-[5px] ${
                      pathname === `/profile/${user?.name}${list.page}`
                        ? "border-b-2 border-b-[#1d9bf0] pb-1"
                        : ""
                    }`}
                  >
                    <Links
                      href={`${list.link}/${user?.name}/${list.page}`}
                      className="relative font-bold px-4 py-2"
                    >
                      {list?.label}
                    </Links>
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden px-4 py-2">
              {pathname === `/profile/${user?.name}` && (
                <div className="mt-5">
                  {user?.biography === null ? (
                    <p className="p-4">
                      This profile does not have biography yet
                    </p>
                  ) : (
                    <div className="inline-block bg-white dark:bg-[#242424] border border-[#00000024] dark:border-[#272727] md:p-4">
                      <EditorContent editor={editor} />
                    </div>
                  )}
                </div>
              )}
              {pathname === `/profile/${user?.name}/watchlist` && (
                <Watchlist
                  tv_id={tv_id}
                  existedFavorite={existedFavorite}
                  user={user}
                />
              )}
              {pathname === `/profile/${user?.name}/lists` && (
                <ProfileList list={list} movieId={movieId} tvId={tvid} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileItem;
