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
}) => {
  return (
    <div className="flex items-center space-x-2 md:space-x-6">
      <button
        name="Notification"
        className="relative pt-1.5"
        onClick={handleNotiDropClick}
      >
        <span className="relative inline-block">
          <IoIosNotificationsOutline className="text-xl md:text-2xl text-white" />
          <span className="absolute top-0.5 right-1 transform translate-x-[50%] -translate-y-[50%]">
            <span
              className={`text-white text-[10px] px-1 md:px-[7px] py-[1px] md:py-[2px] rounded-full bg-[#f44455]`}
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
          <IoMdClose className="text-lg md:text-2xl" />
        ) : (
          <IoSearchSharp className="text-lg md:text-2xl" />
        )}
      </button>
      <div className="block">
        <ThemeSwitch />
      </div>

      {!session && (
        <div className="relative">
          <Link
            aria-label="Sign-in"
            className="text-sm md:text-lg text-white border-[1px] border-cyan-400 bg-cyan-400 px-4 py-1"
            href={`/signin`}
          >
            Login
          </Link>
        </div>
      )}

      {session && (
        <div className="relative" onClick={handleSessionDropClick}>
          <div className="flex items-center cursor-pointer">
            <Image
              src={user?.profileAvatar || (session?.user?.image as string)}
              alt={`${user?.displayName || user?.name}'s Profile`}
              width={33}
              height={33}
              quality={100}
              priority
              className="w-[25px] md:w-[33px] h-[25px] md:h-[33px] bg-cover bg-center object-cover rounded-full"
            />
            <IoMdArrowDropdown className="text-white" />
          </div>

          {sessionDrop && (
            <SessionDropdown
              sessionItems={sessionItems}
              resolvedTheme={resolvedTheme}
              setTheme={setTheme}
              session={session}
              sessionDrop={false}
              outsideRef={outsideRef}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarActions;
