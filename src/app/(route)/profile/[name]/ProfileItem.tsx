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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaCheck, FaList, FaUserCheck } from "react-icons/fa6";
import { IoPersonAddSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { IoIosArrowDown } from "react-icons/io";
import {
  CommentProps,
  FriendRequestProps,
  IFriend,
  IProfileFeeds,
  ProfilePageProps,
  UserProps,
} from "@/helper/type";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { ReviewType } from "../../(id)/tv/[id]/reviews/Reviews";
import Image from "next/image";
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

export interface User {
  user: UserProps | null;
  users: UserProps[] | null;
}

type CommentType = {
  getComment: CommentProps;
};
const ProfileItem: React.FC<
  ProfilePageProps & IFriend & User & ReviewType & IProfileFeeds & CommentType
> = ({
  user,
  users,
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
  getDrama,
  getReview,
  getFeeds,
  getComment,
}) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [friRequestModal, setFriRequestModal] = useState<boolean>(false);
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

  const friendRequestId = friend?.find(
    (item: FriendRequestProps) => item?.friendRequestId
  );

  const currentUserFriends = friend.find(
    (friendItem: any) =>
      (friendItem.friendRequestId === currentUser?.id ||
        friendItem.friendRespondId === currentUser?.id) &&
      friendItem.status === "accepted"
  );

  const getAllCurrentUserFriend = friend?.filter((fri: FriendRequestProps) =>
    [fri?.friendRespondId, fri?.friendRequestId].includes(user?.id as string)
  );

  const getCurrentUserRespondFri = users?.filter((userFri: UserProps) =>
    friend
      ?.filter((stat: FriendRequestProps) => stat?.status !== "pending")
      ?.find((fri: FriendRequestProps) =>
        fri?.friendRespondId?.includes(userFri?.id)
      )
  );

  const currentFriendStatus = friend?.find(
    (fri: FriendRequestProps) =>
      (fri.friendRequestId === currentUser?.id ||
        fri.friendRespondId === currentUser?.id) &&
      (fri.friendRequestId === user?.id || fri.friendRespondId === user?.id)
  )?.status;

  // Manage component mount state to ensure hooks run only on the client
  useEffect(() => {
    setIsMounted(true);

    // Cleanup editor on component unmount
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Prevent rendering until the component has mounted on the client side
  if (!isMounted || !editor) return null;

  if (!editor) {
    return null;
  }
  return (
    <div className="max-w-6xl w-full mx-auto py-3 md:px-6">
      <div className="flex flex-col md:block md:-mx-3">
        <div className="order-2 float-left w-full md:w-[33.33333%] relative px-3">
          <div className="block">
            <div className="relative bg-[#fff] dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#00000024] rounded-md shadow-sm mb-3">
              <div className="text-center px-3 py-2">
                <div className="text-center mb-4">
                  <Image
                    src={user?.profileAvatar || (user?.image as string)}
                    alt={`${user?.displayName || user?.name}'s Profile`}
                    width={980}
                    height={980}
                    quality={100}
                    className="w-full align-middle"
                    priority
                  />
                </div>
                <Links
                  href={`/profile/${user?.name}/lists`}
                  className="block w-full text-black dark:text-[#ffffffde] text-md bg-[#fff] dark:bg-[#3a3b3c] border border-[#d3d3d38c] dark:border-[#3e4042] px-5 py-3 shadow-sm"
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
                      <span>
                        {" "}
                        {friend?.filter((fri: FriendRequestProps) =>
                          fri?.friendRespondId?.includes(user?.id as string)
                        )?.length > 0
                          ? getAllCurrentUserFriend?.filter(
                              (stat: FriendRequestProps) =>
                                stat?.status !== "pending"
                            )?.length
                          : getCurrentUserRespondFri?.length}
                      </span>
                      <span className="block text-[#818a91] md:text-sm lg:text-md">
                        Friends
                      </span>
                    </Links>
                  </div>
                </div>
              </div>
            </div>
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
                        {" "}
                        {lastLogin}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <span className="inline-block mr-1">⚥</span>
                    <b className="inline-block text-sm font-semibold">
                      Gender:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {user?.gender
                          ? user.gender.charAt(0).toUpperCase() +
                            user.gender.slice(1)
                          : ""}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <MapPin className="inline-block mr-1" size={14} />
                    <b className="inline-block text-sm font-semibold">
                      Location:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {" "}
                        {user?.country}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <span className="inline-block mr-1">🎭</span>
                    <b className="inline-block text-sm font-semibold">
                      Roles:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {user?.role === "USER" && "Member"}
                      </span>
                    </b>
                  </li>
                  <li className="block relative p-0">
                    <CalendarDays className="inline-block mr-1" size={14} />
                    <b className="inline-block text-sm font-semibold">
                      Join Date:{" "}
                      <span className="text-sm font-normal opacity-90">
                        {formattedDate}
                      </span>
                    </b>{" "}
                  </li>
                </ul>
              </div>
            </div>

            <div className="block relative bg-[#fff] dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="bg-[#1675b6] text-[#ffffffde] relative px-3 py-2">
                <h3>Recent Lists</h3>
              </div>
              <div className="bg-white dark:bg-[#1b1c1d] px-3 py-2">
                {list?.length !== 0 ? (
                  <RecentLists list={list} movieId={movieId} tvId={tvid} />
                ) : (
                  <div>
                    {user?.displayName || user?.name} does not have any lists
                    yet.
                  </div>
                )}
              </div>
            </div>

            <div className="block relative bg-[#fff] dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#00000024] rounded-md mb-3 overflow-hidden">
              <div className="bg-[#1675b6] text-[#ffffffde] relative px-3 py-2">
                <h3>Friends</h3>
              </div>
              <div className="absolute top-2 right-4">
                <Links href={`/friends/${user?.name}`} className="text-white">
                  View all
                </Links>
              </div>
              <div className="border-b border-b-[#78828c21] m-0"></div>
              <div className="text-center px-3 py-2">
                <Links
                  href=""
                  className="flex flex-wrap items-center relative leading-9 rounded-full whitespace-nowrap"
                >
                  {friend?.filter((fri: FriendRequestProps) =>
                    fri?.friendRespondId?.includes(user?.id as string)
                  )?.length > 0 ? (
                    getAllCurrentUserFriend?.filter(
                      (stat: FriendRequestProps) => stat?.status !== "pending"
                    )?.length > 0 ? (
                      getAllCurrentUserFriend
                        ?.filter(
                          (stat: FriendRequestProps) =>
                            stat?.status !== "pending"
                        )
                        ?.map((fri: FriendRequestProps) => (
                          <Image
                            key={fri?.id}
                            src={fri?.profileAvatar || fri?.image}
                            alt={`${fri?.name}`}
                            width={200}
                            height={200}
                            quality={100}
                            priority
                            className="w-[40px] h-[40px] bg-center bg-cover object-cover align-middle rounded-full mr-3"
                          />
                        ))
                    ) : (
                      <div>
                        {user?.displayName || user?.name} does not have any
                        friends yet.
                      </div>
                    )
                  ) : getCurrentUserRespondFri?.length !== 0 ? (
                    getCurrentUserRespondFri?.map((fri) => (
                      <Image
                        key={fri?.id}
                        src={fri?.profileAvatar || (fri?.image as string)}
                        alt={`${fri?.name}`}
                        width={200}
                        height={200}
                        quality={100}
                        priority
                        className="w-[40px] h-[40px] bg-center bg-cover object-cover align-middle rounded-full mr-3"
                      />
                    ))
                  ) : (
                    <div>
                      {user?.displayName || user?.name} does not have any
                      friends yet.
                    </div>
                  )}
                </Links>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 float-left w-full md:w-[66.66667%] relative px-3">
          <CoverPhoto user={user} users={users} currentUser={currentUser} />
          <div className="inline-block w-full h-full bg-[#fff] dark:bg-[#242526] relative border border-[#d3d3d38c] dark:border-[#00000024] rounded-md shadow-sm mb-3">
            <div className="inline-block w-full h-full relative mt-5 md:mt-2">
              <div className="float-left relative px-3 mb-2">
                <div className="md:hidden">
                  <div className="float-left w-[16.66667%] relative">
                    <div className="w-[64px] h-[64px] inline-block relative whitespace-nowrap rounded-full mb-3">
                      <Image
                        src={user?.profileAvatar || user?.image || ""}
                        alt={`${user?.displayName || user?.name} Profile`}
                        width={200}
                        height={200}
                        quality={100}
                        priority
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
                                friendRequestId?.friendRequestId?.toString() as string
                              )
                            }
                          >
                            <p>Unfriend</p>
                          </span>
                        )}
                      </button>
                    )}

                  {friend?.find(
                    (fri: FriendRequestProps) =>
                      currentUser?.id === fri?.friendRequestId
                  )?.status === "pending" && (
                    <button
                      type="button"
                      name="friend button"
                      className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
                      onClick={() => setFriRequestModal(!friRequestModal)}
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
                        <span className="tex-xs md:text-sm pt-[2px]">
                          Friend Request Sent
                        </span>
                      </span>
                      {friRequestModal && (
                        <span
                          className="text-xs md:text-sm absolute top-[40px] md:top-[50px] right-[89px] md:right-[97px] dark:bg-[#3a3b3c] dark:bg-opacity-50 rounded-md px-5 md:px-6 py-2"
                          onClick={() =>
                            deleteFriend(currentUser?.id as string)
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

                  {friend?.filter(
                    (fri: FriendRequestProps) =>
                      currentUser?.id === fri?.friendRespondId
                  )?.length > 0 &&
                    friend
                      ?.filter(
                        (item: FriendRequestProps) => item?.status === "pending"
                      )
                      .map((item: FriendRequestProps, idx: number) => (
                        <div key={idx} className="mr-3">
                          <AcceptRejectButton friend={friend} item={item} />
                        </div>
                      ))}

                  <FollowButton
                    user={user}
                    currentUser={currentUser}
                    users={null}
                  />
                </div>
              )}
              <Tabs className="inline-block w-full h-full  border-b border-b-[#78828c21] -my-4 mt-4">
                {profileList?.map((list: any, idx: number) => (
                  <TabsList
                    key={idx}
                    id={list.id}
                    className={`float-left -mb-1 my-1 cursor-pointer ${
                      pathname === `/profile/${user?.name}${list.page}`
                        ? "bg-white rounded-md"
                        : ""
                    }`}
                  >
                    <TabsTrigger value={list?.label}>
                      <Links
                        prefetch={true}
                        href={`${list.link}/${user?.name}/${list.page}`}
                        className="relative text-xs md:text-sm font-bold px-4 py-2"
                      >
                        {list?.label}
                      </Links>
                    </TabsTrigger>
                  </TabsList>
                ))}
              </Tabs>
            </div>
            <div className="overflow-hidden px-4 py-2">
              {pathname === `/profile/${user?.name}` && (
                <div className="mt-5">
                  {user?.biography === null ? (
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

              {pathname === `/profile/${user?.name}/watchlist` && (
                <Watchlist
                  tv_id={tv_id}
                  existedFavorite={existedFavorite}
                  user={user}
                  list={list}
                  tvId={tvid}
                  movieId={movieId}
                />
              )}
              {pathname === `/profile/${user?.name}/lists` && (
                <ProfileList list={list} movieId={movieId} tvId={tvid} />
              )}
              {pathname === `/profile/${user?.name}/feeds` && (
                <Feeds
                  user={user}
                  users={users}
                  currentUser={currentUser}
                  getFeeds={getFeeds}
                  getComment={getComment as CommentProps[] | any}
                />
              )}
            </div>{" "}
            {pathname === `/profile/${user?.name}/reviews` && (
              <ProfileReviews
                getDrama={getDrama}
                getReview={getReview}
                currentUser={currentUser}
                tv_id=""
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileItem;
