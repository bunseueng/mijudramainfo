"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoCloseCircle, IoMenu, IoSearchSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import {
  movie_subitems,
  navbar_items,
  people_subitems,
  sessionItems,
  tv_subitems,
} from "@/helper/item-list";
import {
  IoIosNotificationsOutline,
  IoMdArrowDropdown,
  IoMdClose,
} from "react-icons/io";
import { useSession, signIn, signOut } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import SearchResult from "../Search/SearchResult";
import NotificationModal from "../Modal/NotificationModal";
import {
  CommentProps,
  currentUserProps,
  findSpecificUserProps,
  FriendRequestProps,
  UserProps,
} from "@/helper/type";

interface Notification {
  users: UserProps[] | undefined;
  user: UserProps | undefined;
  currentUser: currentUserProps | null;
  friend: FriendRequestProps[];
  findSpecificUser: findSpecificUserProps[] | null[];
  yourFriend: findSpecificUserProps[] | null[];
  comment: CommentProps[];
}

const Navbar: React.FC<Notification> = ({
  users,
  user,
  currentUser,
  yourFriend,
  friend,
  findSpecificUser,
  comment,
}) => {
  const [showResults, setShowResults] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [nav, setNav] = useState<boolean>(true);
  const [hovered, setHovered] = useState<boolean>(false); // Track navbar_items and subitems hover
  const [navbarItemsHovered, setNavbarItemsHovered] = useState<boolean>(false);
  const [dropLogin, setDropLogin] = useState<boolean>(false);
  const [sessionDrop, setSessionDrop] = useState<boolean>(false);
  const [notiDrop, setNotiDrop] = useState<boolean>(false);
  const [read, setRead] = useState<boolean>(false);
  const [navSearch, setNavSearch] = useState<string>("");
  const [repliedUserId, setRepliedUserId] = useState<string[]>();
  const [userId, setUserId] = useState<string[]>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("query") ?? "";
  const router = useRouter();
  const { data: session } = useSession();

  const onInput = (e: any) => {
    const { name, value } = e.target;
    if (name === "navSearch") {
      setNavSearch(value);
    } else {
      setNavSearch(value);
    }
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.push(`${pathname}/?${params.toString()}`);
  };

  const onSearch = (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    router.push(`/search/?${params.toString()}`);
    setShowResults(false); // Hide search results when submitting
    setShowSearch(!showSearch);
  };

  const handleNavbarMouseEnter = (label: string) => {
    if (label === "Explore") {
      setNavbarItemsHovered(true); // Set navbarItemsHovered to true when entering navbar_items
      setHovered(true); // Set hovered to true when entering navbar_items
    }
  };

  const handleNavbarMouseLeave = (id: number) => {
    setNavbarItemsHovered(false); // Hide subitems when leaving navbar_items
    setHovered(false); // Set hovered to false when leaving navbar_items
  };

  const handleSubitemsMouseEnter = () => {
    if (navbarItemsHovered) {
      setHovered(true);
    } else {
      setHovered(false);
    }
  };

  const handleSubitemsMouseLeave = () => {
    setHovered(false); // Set hovered to false when leaving subitems
  };

  useEffect(() => {
    return () => {
      // Reset the states when component unmounts (page changes)
      setHovered(false);

      setNavbarItemsHovered(false);
    };
  }, []);

  useEffect(() => {
    comment.forEach((c) => {
      if (c.replies?.length === 0) {
      } else {
        c.replies?.forEach((reply: any) => {
          setRepliedUserId((prevRepliedUserId) => [
            ...(prevRepliedUserId || []),
            reply.repliedUserId,
          ]);
          setUserId((prevUserId) => [...(prevUserId || []), reply.userId]);
        });
      }
    });
  }, [comment]);

  const acceptedRequests = friend.filter((item) => item.status === "accepted");
  const rejectedRequests = friend.filter((item) => item.status === "rejected");
  const pendingRequests = friend.filter((item) => item.status === "pending");
  const isPending = pendingRequests.filter(
    (req) =>
      req.friendRequestId === currentUser?.id ||
      req.friendRespondId === currentUser?.id
  );
  const isAccepted = acceptedRequests.filter(
    (req) =>
      req.friendRequestId === currentUser?.id ||
      req.friendRespondId === currentUser?.id
  );
  const isRejected = rejectedRequests.filter(
    (req) =>
      req.friendRequestId === currentUser?.id ||
      req.friendRespondId === currentUser?.id
  );
  const status = [...isPending, ...isAccepted, ...isRejected];
  status.sort((a: any, b: any) => {
    return (
      new Date(b?.actionDatetime).getTime() -
      new Date(a?.actionDatetime).getTime()
    );
  });

  const friendNoti = status.map((fri) => fri?.notification).flat();
  // Check if there are any unread reply notifications
  const findReply = comment
    .map((com) =>
      com.replies?.filter((rp: any) => rp?.userId === currentUser?.id)
    )
    .flat();
  const findRpNoti = findReply.filter(
    (item: any) => item?.notification === "unread"
  ).length;

  // Check if there are any read reply notifications
  const readRepliesCount = findReply.filter(
    (item: any) => item?.notification === "unread"
  ).length;

  // Check if there are any unread friend notifications
  const hasUnreadFriends = friendNoti.includes("unread");

  return (
    <nav className="bg-gradient-to-r from-sky-900 to-blue-800">
      <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-3 px-4 md:px-6">
        <div className="flex items-center">
          <Link
            className="no-underline hover:no-underline font-bold text-2xl lg:text-4xl flex items-center"
            href="/"
          >
            <p className="text-lg md:text-2xl text-cyan-400">MijuDramaList</p>
            <Image
              src="/untitled.svg"
              alt="Website logo"
              width={200}
              height={200}
              quality={100}
              className="w-[25px] h-[50px] md:w-[50px]"
            />
          </Link>

          <div
            className={`absolute top-0 right-0 left-0 flex items-end overflow-hidden bg-navy-800 lg:h-full lg:relative lg:inset-0 justify-between w-full lg:flex lg:w-auto lg:order-1 ${
              nav ? "hidden" : "block"
            }`}
          >
            <div className="relative mt-3 lg:hidden">
              <input
                type="text"
                className="hidden lg:block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
            <ul className="hidden lg:flex flex-col mt-4 font-medium border border-gray-100 rounded-b-md lg:flex-row lg:mt-0 lg:border-0 dark:border-gray-700">
              {navbar_items?.map((item: any, idx: number) => (
                <li
                  key={idx}
                  onMouseEnter={() => handleNavbarMouseEnter(item?.label)}
                  onMouseLeave={() => handleNavbarMouseLeave(idx)}
                >
                  <Link
                    href={item?.link}
                    className="block py-2 px-2 xl:px-3 text-sm xl:text-lg text-white rounded lg:bg-transparent cursor-default"
                  >
                    <span className="cursor-pointer">{item?.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="w-[325px] h-screen bg-[#e9eaed] border-[#06090c21] p-5 lg:hidden dark:bg-[#242424] z-10">
              <IoCloseCircle
                onClick={() => setNav(!nav)}
                size={35}
                className="my-2 text-slate-400 cursor-pointer hover:opacity-70 transform duration-300"
              />
              <h1 className="text-2xl font-bold py-4">Shows</h1>
              {tv_subitems.map((item: any, idx: number) => (
                <div key={idx} className="text-black dark:text-white pl-4 py-2">
                  <p>{item.label}</p>
                </div>
              ))}
              <h1 className="text-2xl font-bold py-4">Movies</h1>
              {movie_subitems.map((item: any, idx: number) => (
                <div key={idx} className="text-black dark:text-white pl-4 py-2">
                  <p>{item.label}</p>
                </div>
              ))}
              <h1 className="text-2xl font-bold py-4">People</h1>
              {people_subitems.map((item: any, idx: number) => (
                <div key={idx} className="text-black dark:text-white pl-4 py-2">
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 15,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute top-2 left-[235px] w-[600px] h-[280px] bg-gray-100 dark:bg-[#272727] flex mt-[45px] mx-3 ${
            hovered ? "block" : "hidden"
          }`}
          onMouseEnter={handleSubitemsMouseEnter}
          onMouseLeave={handleSubitemsMouseLeave}
        >
          <ul className="p-2 border-r border-r-slate-400 bg-white dark:bg-[#595959]">
            <span className="text-md md:text-lg text-slate-400 font-bold my-1 px-2 xl:px-3">
              Tv Shows
            </span>
            {tv_subitems?.map((items: any, idx: number) => (
              <li key={idx}>
                <Link
                  href={items?.link}
                  className="block py-2 px-2 xl:px-3 text-sm xl:text-md text-black dark:text-white font-semibold rounded lg:bg-transparent cursor-pointer hover:bg-slate-200 transform duration-300"
                >
                  <span className="text-[16px] cursor-pointer">
                    {items?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="py-2 px-5">
            <span className="text-md md:text-lg text-slate-400 font-bold my-1 px-2 xl:px-3">
              Movies
            </span>
            {movie_subitems?.map((items: any, idx: number) => (
              <li key={idx}>
                <Link
                  href={items?.link}
                  className="block py-2 px-2 xl:px-3 text-sm xl:text-md text-black dark:text-white font-semibold rounded lg:bg-transparent cursor-pointer hover:bg-slate-200 transform duration-300"
                >
                  <span className="text-[16px] cursor-pointer">
                    {items?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="py-2 px-5">
            <span className="text-md md:text-lg text-slate-400 font-bold my-1 px-2 xl:px-3">
              People
            </span>
            {people_subitems?.map((items: any, idx: number) => (
              <li key={idx}>
                <Link
                  href={items?.link}
                  className="block py-2 px-2 xl:px-3 text-sm xl:text-md text-black dark:text-white font-semibold rounded lg:bg-transparent cursor-pointer hover:bg-slate-200 transform duration-300"
                >
                  <span className="text-[16px] cursor-pointer">
                    {items?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
        <div className="flex items-center lg:order-2">
          <button
            className="mx-1 md:mx-2 relative"
            onClick={() => setNotiDrop(!notiDrop)}
          >
            <span className="relative">
              <IoIosNotificationsOutline className="text-lg md:text-2xl" />
              {hasUnreadFriends ? (
                <span className="absolute -top-2">
                  <span
                    className={`min-w-[4px] min-h-[4px] text-xs px-1 rounded-md ${
                      hasUnreadFriends ? "bg-[#f44455]" : "bg-transparent"
                    }`}
                  >
                    {(isPending?.length > 0 &&
                      isPending?.length + readRepliesCount) ||
                      (isAccepted?.length > 0 &&
                        isAccepted?.length + readRepliesCount) ||
                      (isRejected?.length > 0 &&
                        isRejected?.length + readRepliesCount)}
                  </span>
                </span>
              ) : null}
              {findRpNoti ? (
                <span className="absolute -top-2">
                  <span
                    className={`min-w-[4px] min-h-[4px] text-xs px-1 rounded-md ${
                      findRpNoti ? "bg-[#f44455]" : "bg-transparent"
                    }`}
                  >
                    {hasUnreadFriends
                      ? (isPending?.length > 0 &&
                          isPending?.length + readRepliesCount) ||
                        (isAccepted?.length > 0 &&
                          isAccepted?.length + readRepliesCount) ||
                        (isRejected?.length > 0 &&
                          isRejected?.length + readRepliesCount)
                      : readRepliesCount}
                  </span>
                </span>
              ) : null}
            </span>
          </button>
          {notiDrop && (
            <NotificationModal
              users={users}
              user={user}
              currentUser={currentUser}
              findSpecificUser={findSpecificUser}
              yourFriend={yourFriend}
              friend={friend}
              userId={userId}
              repliedUserId={repliedUserId}
              read={read}
              setRead={setRead}
              comment={comment}
            />
          )}
          <button
            type="button"
            className={`text-white rounded-lg text-sm mx-1 md:mx-2 ${
              showSearch ? "block" : "hidden"
            }`}
            onClick={() => setShowSearch(!showSearch)}
          >
            <IoSearchSharp className="text-lg md:text-2xl lg:mr-2" />
          </button>
          <button
            type="button"
            className={`text-white rounded-lg text-sm mx-1 md:mx-4 ${
              showSearch ? "hidden" : "block"
            }`}
            onClick={() => setShowSearch(!showSearch)}
          >
            <IoMdClose className="text-lg md:text-2xl" />
          </button>
          <button
            onClick={() => setNav(!nav)}
            className="mx-1 md:mx-2 lg:hidden"
          >
            <IoMenu className="text-lg md:text-2xl mr-2" />
          </button>
          {!session && (
            <div className="relative">
              <button
                className="text-sm md:text-lg text-white mx-2 md:mx-4 border border-cyan-400 bg-cyan-400 px-4 py-1"
                onClick={() => setDropLogin(!dropLogin)}
              >
                Login
              </button>
              {dropLogin && (
                <ul className="absolute top-[51.5px] right-2 md:top-[55.87px] md:right-4 bg-white dark:bg-[#242424] pl-4 pr-14 py-5">
                  <li
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => signIn("google")}
                  >
                    <FcGoogle size={25} />{" "}
                    <span className="pl-3 font-semibold">Google</span>
                  </li>
                  <li
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => signIn("github")}
                  >
                    <FaGithub size={25} />
                    <span className="pl-3 font-semibold">Github</span>
                  </li>
                </ul>
              )}
            </div>
          )}
          {session && (
            <>
              <div
                className="relative"
                onClick={() => setSessionDrop(!sessionDrop)}
              >
                <div className="flex items-center cursor-pointer">
                  <Image
                    src={
                      user?.profileAvatar || (session?.user?.image as string)
                    }
                    alt="pf"
                    width={100}
                    height={100}
                    quality={100}
                    className="w-[35px] h-[35px] bg-cover bg-center object-cover rounded-full"
                  />
                  <IoMdArrowDropdown />
                </div>
                {sessionDrop && (
                  <>
                    <ul className="w-[300px] flex flex-col absolute top-[54px] right-0 bg-white dark:bg-[#242424]">
                      {sessionItems?.map((item: any, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-center m-4 cursor-pointer"
                        >
                          {item?.icon}{" "}
                          <Link
                            href={`${
                              item.link === "/profile"
                                ? `${item?.link}/${session?.user?.name}`
                                : item?.link
                            }`}
                            className="ml-2"
                          >
                            {item?.label}
                          </Link>
                        </li>
                      ))}
                      <li className="w-full border-b-2 border-b-slate-700"></li>
                      <li
                        className="flex items-center m-4 cursor-pointer"
                        onClick={() => signOut()}
                      >
                        <RiLogoutCircleRLine />
                        <span className="ml-2">Sign out</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <form
        className={`w-full fixed bg-white ${showSearch ? "hidden" : "block"}`}
        onSubmit={onSearch}
      >
        <div className="border-b-2 border-b-slate-300">
          <div className="max-w-[1520px] mx-auto relative">
            <div className="absolute inset-y-0 left-3 flex items-center pl-3 pointer-events-none">
              <IoSearchSharp size={20} className="dark:text-black" />
            </div>
            <input
              type="text"
              className="w-full bg-white text-[#acacac] font-bold italic outline-none px-14 py-3"
              name="navSearch"
              placeholder="Search for a movie, tv show, person..."
              onChange={onInput}
              value={navSearch}
            />
          </div>
        </div>
        {query && showResults && <SearchResult />}
      </form>
    </nav>
  );
};

export default Navbar;
