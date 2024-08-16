"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoCloseCircle, IoMenu, IoSearchSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
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
import { useSession, signOut } from "next-auth/react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import SearchResult from "../Search/SearchResult";
import NotificationModal from "../Modal/NotificationModal";
import {
  CommentProps,
  currentUserProps,
  findSpecificUserProps,
  FriendRequestProps,
  SearchParamsType,
  UserProps,
} from "@/helper/type";
import { useDebouncedCallback } from "use-debounce";

interface Notification {
  users: UserProps[] | undefined;
  user: UserProps | undefined;
  currentUser: currentUserProps | null;
  friend: FriendRequestProps[];
  findSpecificUser: findSpecificUserProps[] | null[];
  yourFriend: findSpecificUserProps[] | null[];
  comment: CommentProps[];
}
const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
};

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
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [nav, setNav] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false); // Track navbar_items and subitems hover
  const [navbarItemsHovered, setNavbarItemsHovered] = useState<boolean>(false);
  const [sessionDrop, setSessionDrop] = useState<boolean>(false);
  const [notiDrop, setNotiDrop] = useState<boolean>(false);
  const [navSearch, setNavSearch] = useState<string>("");
  const [repliedUserId, setRepliedUserId] = useState<string[]>();
  const [userId, setUserId] = useState<string[]>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams?.get("query") ?? "";
  const router = useRouter();
  const { data: session } = useSession();

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNavSearch(value); // Update state immediately

    // Debounce the URL update
    debouncedUpdateURL(value);
  };

  const debouncedUpdateURL = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    // Update the URL with the debounced value
    router.replace(`${pathname}/?${params.toString()}`);
  }, 300);

  const onSearch = (e: React.ChangeEvent<EventTarget>) => {
    e.preventDefault();
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );

    if (navSearch) {
      params.set("query", navSearch);
    } else {
      params.delete("query");
    }

    // Navigate to the search page with the query parameter
    router.push(`/search/?${params.toString()}`);
    setShowResults(false); // Hide search results when submitting
    setShowSearch(!showSearch);
  };

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleNavbarMouseEnter = (label: string) => {
    if (label === "Explore") {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setNavbarItemsHovered(true);
      setHovered(true);
    }
  };

  const handleNavbarMouseLeave = (idx: number) => {
    hoverTimeout.current = setTimeout(() => {
      setNavbarItemsHovered(false);
      setHovered(false);
    }, 200);
  };

  const handleSubitemsMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(true);
  };

  const handleSubitemsMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
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
  const isRepliedItself = comment
    .map((com) =>
      com.replies?.filter((rp: any) => rp?.repliedUserId === currentUser?.id)
    )
    .flat();
  // Check if there are any read reply notifications
  const readRepliesCount = findReply.filter(
    (item: any) => item?.notification === "unread"
  ).length;

  // Check if there are any unread friend notifications
  const hasUnreadFriends = friendNoti.includes("unread");

  const handleNavClick = () => {
    setNav(!nav);
    if (!nav) {
      setNotiDrop(false); // Close notiDrop when opening sessionDrop
      setSessionDrop(false);
      setShowSearch(false);
    }
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setNav;
      setNotiDrop(false); // Close notiDrop when opening sessionDrop
      setSessionDrop(false);
    }
  };

  const handleNotiDropClick = () => {
    setNotiDrop(!notiDrop);
    if (!notiDrop) {
      setSessionDrop(false);
      setNav(false);
      setShowSearch(false);
    }
  };

  const handleSessionDropClick = () => {
    setSessionDrop(!sessionDrop);
    if (!sessionDrop) {
      setNotiDrop(false);
      setNav(false);
      setShowSearch(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-sky-900 to-blue-800">
      <div className="max-w-[1520px] relative flex flex-wrap items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center relative py-1">
          <Link
            className="no-underline hover:no-underline font-bold text-2xl lg:text-4xl flex items-center"
            href="/"
          >
            <p className="text-lg md:text-2xl text-cyan-400">MijuDramaInfo</p>
            <Image
              src="/Untitled.svg"
              alt="Website logo"
              width={200}
              height={200}
              quality={100}
              className="w-[25px] h-[50px] md:w-[50px]"
            />
          </Link>

          <div className="absolute top-0 right-0 left-0 flex items-end overflow-hidden bg-navy-800 lg:h-full lg:relative lg:inset-0 justify-between w-full lg:flex lg:w-auto lg:order-1">
            <div className="relative mt-3 lg:hidden">
              <input
                type="text"
                className="hidden lg:block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
            <ul className="hidden lg:flex flex-col relative mt-4 font-medium border border-gray-100 rounded-b-md lg:flex-row lg:mt-0 lg:border-0 dark:border-gray-700">
              {navbar_items?.map((item, idx) => (
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
            <AnimatePresence>
              {nav && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 1,
                  }}
                  className="w-[325px] h-screen bg-[#e9eaed] border-[#06090c21] p-5 lg:hidden dark:bg-[#242424] z-10"
                >
                  <IoCloseCircle
                    onClick={handleNavClick}
                    size={35}
                    className="my-2 text-slate-400 cursor-pointer hover:opacity-70 transform duration-300"
                  />
                  <h1 className="text-2xl font-bold py-4">Shows</h1>
                  {tv_subitems.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-black dark:text-white pl-4 py-2"
                    >
                      <p>{item.label}</p>
                    </div>
                  ))}
                  <h1 className="text-2xl font-bold py-4">Movies</h1>
                  {movie_subitems.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-black dark:text-white pl-4 py-2"
                    >
                      <p>{item.label}</p>
                    </div>
                  ))}
                  <h1 className="text-2xl font-bold py-4">People</h1>
                  {people_subitems.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-black dark:text-white pl-4 py-2"
                    >
                      <p>{item.label}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 15,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute top-[14px] left-[235px] w-[600px] h-[280px] bg-gray-100 dark:bg-[#18191a] flex mt-[45px] rounded-md mx-3 ${
            hovered ? "block" : "hidden"
          }`}
          onMouseEnter={handleSubitemsMouseEnter}
          onMouseLeave={handleSubitemsMouseLeave}
        >
          <ul className="p-2 border-r border-r-slate-400 bg-white dark:bg-[#242526]">
            <span className="text-md text-[#818a91] my-1 px-2 xl:px-3">
              Tv Shows
            </span>
            {tv_subitems?.map((items: any, idx: number) => (
              <li key={idx}>
                <Link
                  href={items?.link}
                  className="block py-2 px-2 xl:px-3 text-sm xl:text-md text-black dark:text-white font-semibold rounded lg:bg-transparent cursor-pointer hover:bg-slate-200 transform duration-300"
                >
                  <span className="text-xs cursor-pointer">{items?.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="py-2 px-5">
            <span className="text-md text-[#818a91] my-1 px-2 xl:px-3">
              Movies
            </span>
            {movie_subitems?.map((items: any, idx: number) => (
              <li key={idx}>
                <Link
                  href={items?.link}
                  className="block py-2 px-2 xl:px-3 text-sm xl:text-md text-black dark:text-white font-semibold rounded lg:bg-transparent cursor-pointer hover:bg-slate-200 transform duration-300"
                >
                  <span className="text-xs cursor-pointer">{items?.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="py-2 px-5">
            <span className="text-md text-[#818a91] my-1 px-2 xl:px-3">
              People
            </span>
            {people_subitems?.map((items: any, idx: number) => (
              <li key={idx}>
                <Link
                  href={items?.link}
                  className="block py-2 px-2 xl:px-3 text-sm xl:text-md text-black dark:text-white font-semibold rounded lg:bg-transparent cursor-pointer hover:bg-slate-200 transform duration-300"
                >
                  <span className="text-xs cursor-pointer">{items?.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
        <div className="flex items-center lg:order-2">
          <button
            className="mx-1 md:mx-2 relative"
            onClick={handleNotiDropClick}
          >
            <span className="relative">
              <IoIosNotificationsOutline className="text-lg md:text-2xl text-white" />
              {hasUnreadFriends && isRepliedItself?.length < 1 ? (
                <span className="absolute -top-2">
                  <span
                    className={`text-white min-w-[4px] min-h-[4px] text-xs px-1 rounded-md ${
                      hasUnreadFriends && isRepliedItself?.length < 1
                        ? "bg-[#f44455]"
                        : "bg-transparent"
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
              {findRpNoti && isRepliedItself?.length < 1 ? (
                <span className="absolute -top-2">
                  <span
                    className={`text-white min-w-[4px] min-h-[4px] text-xs px-1 rounded-md ${
                      findRpNoti && isRepliedItself?.length < 1
                        ? "bg-[#f44455]"
                        : "bg-transparent"
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
              currentUser={currentUser}
              findSpecificUser={findSpecificUser}
              yourFriend={yourFriend}
              friend={friend}
              comment={comment}
            />
          )}
          <button
            type="button"
            className={`text-white rounded-lg text-sm mx-1 md:mx-2 ${
              showSearch ? "hidden" : "block"
            }`}
            onClick={handleSearchClick}
          >
            <IoSearchSharp className="text-lg md:text-2xl lg:mr-2" />
          </button>
          <button
            type="button"
            className={`text-white rounded-lg text-sm mx-1 md:mx-4 ${
              showSearch ? "block" : "hidden"
            }`}
            onClick={handleSearchClick}
          >
            <IoMdClose className="text-lg md:text-2xl" />
          </button>
          <button onClick={handleNavClick} className="mx-1 md:mx-2 lg:hidden">
            <IoMenu className="text-white text-lg md:text-2xl mr-2" />
          </button>
          {!session && (
            <div className="relative">
              <Link
                className="text-sm md:text-lg text-white mx-2 md:mx-4 border border-cyan-400 bg-cyan-400 px-4 py-1"
                href={`/signin`}
              >
                Login
              </Link>
            </div>
          )}
          {session && (
            <>
              <div className="relative" onClick={handleSessionDropClick}>
                <div className="flex items-center cursor-pointer">
                  <Image
                    src={
                      user?.profileAvatar
                        ? user?.profileAvatar
                        : (session?.user?.image as string) || "/empty-pf.jpg"
                    }
                    alt="pf"
                    width={100}
                    height={100}
                    quality={100}
                    className="w-[35px] h-[35px] bg-cover bg-center object-cover rounded-full"
                  />
                  <IoMdArrowDropdown className="text-white" />
                </div>
                {sessionDrop && (
                  <AnimatePresence>
                    <motion.ul
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-[300px] flex flex-col absolute top-[54.5px] right-0 bg-white dark:bg-[#242424] rounded-md shadow-md"
                    >
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
                      <li className="w-full border-b-2 border-b-[#78828c21] dark:border-b-slate-700"></li>
                      <li
                        className="flex items-center m-4 cursor-pointer"
                        onClick={() => signOut()}
                      >
                        <RiLogoutCircleRLine />
                        <span className="ml-2">Sign out</span>
                      </li>
                    </motion.ul>
                  </AnimatePresence>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showSearch && (
          <motion.form
            key="search-form"
            action="search"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 50,
              duration: 1,
            }}
            className="w-full fixed bg-white"
            onSubmit={onSearch}
          >
            <div className="border-b-2 border-b-slate-300">
              <div className="max-w-[1520px] mx-auto relative">
                <div className="absolute inset-y-0 left-3 flex items-center pl-3 pointer-events-none">
                  <IoSearchSharp size={20} className="dark:text-black" />
                </div>
                <input
                  type="text"
                  className="w-full bg-white text-[#acacac] placeholder:font-semibold font-semibold italic outline-none px-14 py-3"
                  name="navSearch"
                  placeholder="Search for a movie, tv show, person..."
                  onChange={onInput}
                  value={navSearch}
                />
              </div>
            </div>
            {query && showResults && <SearchResult />}
          </motion.form>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
