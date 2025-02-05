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
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
      <button
        name="Notification"
        aria-label="Notification"
        className="relative p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
        onClick={handleNotiDropClick}
      >
        <span className="relative inline-block align-middle">
          <IoIosNotificationsOutline className="text-xl sm:text-2xl text-white" />
          <span className="absolute top-0.5 right-1 transform translate-x-[50%] -translate-y-[50%]">
            <span
              className={`text-white text-[10px] md:text-[10px] px-[7px] md:px-[7px] py-[2px] md:py-[2px] rounded-full bg-[#f44455]`}
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
        className="text-white rounded-full p-1.5 sm:p-2 hover:bg-white/10 transition-colors"
        onClick={handleSearchClick}
      >
        {showSearch ? (
          <IoMdClose className="text-xl sm:text-2xl" />
        ) : (
          <IoSearchSharp className="text-xl sm:text-2xl" />
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
            className="group flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] min-w-[70px] sm:min-w-[80px]"
            href={`/signin`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full blur-sm"></span>
            <FaUserSecret
              size={14}
              className="mr-1.5 sm:mr-2 transform group-hover:rotate-12 transition-transform duration-300 ease-in-out"
            />
            <span className="relative z-10">Login</span>
          </Link>
        </div>
      )}

      {session && (
        <div className="relative">
          <button
            ref={triggerRef}
            name="Session"
            aria-label="Session"
            className="flex items-center cursor-pointer p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors min-h-[32px] sm:min-h-[36px] md:min-h-[40px]"
            onClick={handleSessionDropClick}
          >
            <Image
              src={user?.profileAvatar || (session?.user?.image as string)}
              alt={
                `${user?.displayName || user?.name}'s Profile` || "User Profile"
              }
              width={28}
              height={28}
              quality={100}
              priority
              fetchPriority="high"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-[33px] md:h-[33px] bg-cover bg-center object-cover rounded-full"
            />
            <IoMdArrowDropdown className="text-white text-lg sm:text-xl" />
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
