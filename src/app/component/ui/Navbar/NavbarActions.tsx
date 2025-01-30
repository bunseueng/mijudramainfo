import React, { MutableRefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IoIosNotificationsOutline,
  IoMdArrowDropdown,
  IoMdClose,
} from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import SessionDropdown from "./SessionDropdown";
import ThemeSwitch from "@/components/ui/ThemeIcon";
import { FaUserSecret } from "react-icons/fa6";

interface NavbarActionsProps {
  showSearch: boolean;
  handleSearchClick: () => void;
  handleNotiDropClick: () => void;
  notificationCount: number;
  hasUnreadFriends: boolean;
  findRpNoti: number;
  session: any;
  user: any;
  handleSessionDropClick: () => void;
  triggerRef: MutableRefObject<null>;
}

export interface SessionDropdownProps {
  sessionDrop: boolean;
  sessionItems: any[];
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
  session: any;
  outsideRef: MutableRefObject<null>;
}

const NavbarActions: React.FC<NavbarActionsProps & SessionDropdownProps> = ({
  showSearch,
  handleSearchClick,
  handleNotiDropClick,
  notificationCount,
  hasUnreadFriends,
  findRpNoti,
  session,
  user,
  handleSessionDropClick,
  sessionItems,
  resolvedTheme,
  setTheme,
  sessionDrop,
  outsideRef,
  triggerRef,
}) => {
  return (
    <div className="flex items-center space-x-2 md:space-x-6">
      <button
        name="Notification"
        className="relative pt-1.5"
        onClick={handleNotiDropClick}
      >
        <span className="relative inline-block">
          <IoIosNotificationsOutline className="text-md md:text-2xl text-white" />
          <span className="absolute top-0.5 right-1 transform translate-x-[50%] -translate-y-[50%]">
            <span
              className={`text-white text-[8px] md:text-[10px] px-1 md:px-[7px] py-[1px] md:py-[2px] rounded-full bg-[#f44455]`}
            >
              {(hasUnreadFriends || findRpNoti) && (
                <span>{notificationCount > 0 ? notificationCount : 0}</span>
              )}
            </span>
          </span>
        </span>
      </button>

      <button
        type="button"
        name="Search"
        aria-label="Search"
        className="text-white rounded-lg text-sm"
        onClick={handleSearchClick}
      >
        {showSearch ? (
          <IoMdClose className="text-md md:text-2xl" />
        ) : (
          <IoSearchSharp className="text-md md:text-2xl" />
        )}
      </button>
      <div className="hidden md:block">
        <ThemeSwitch />
      </div>

      {!session && (
        <div className="relative">
          <Link
            prefetch={false}
            aria-label="Sign-in"
            className="group flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95"
            href={`/signin`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full blur-sm"></span>
            <FaUserSecret
              size={12}
              className="mr-1 sm:mr-1.5 md:mr-2 transform group-hover:rotate-12 transition-transform duration-300 ease-in-out"
            />
            <span className="relative z-10">Login</span>
          </Link>
        </div>
      )}

      {session && (
        <div className="relative">
          <button
            ref={triggerRef}
            className="flex items-center cursor-pointer"
            onClick={handleSessionDropClick}
          >
            <Image
              src={user?.profileAvatar || (session?.user?.image as string)}
              alt={
                `${user?.displayName || user?.name}'s Profile` || "User Profile"
              }
              width={33}
              height={33}
              quality={100}
              priority
              className="w-[25px] md:w-[33px] h-[25px] md:h-[33px] bg-cover bg-center object-cover rounded-full"
            />
            <IoMdArrowDropdown className="text-white" />
          </button>

          {sessionDrop && (
            <SessionDropdown
              sessionItems={sessionItems}
              resolvedTheme={resolvedTheme}
              setTheme={setTheme}
              session={session}
              sessionDrop={sessionDrop}
              outsideRef={outsideRef}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarActions;
