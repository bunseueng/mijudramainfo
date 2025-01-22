"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useScrollContext } from "@/provider/UseScroll";
import { AnimatePresence, motion, useTransform } from "framer-motion";

// Helper imports
import { navbar_items, sessionItems, sidebar_items } from "@/helper/item-list";
import {
  CommentProps,
  currentUserProps,
  findSpecificUserProps,
  FriendRequestProps,
  UserProps,
} from "@/helper/type";

// Component imports
import SearchInput from "../Search/SearchInput";
import NavbarLogo from "./NavbarLogo";
import NavbarItems from "./NavbarItems";
import NavbarActions from "./NavbarActions";
import NavbarDropdownMenu from "./NavbarDropdownMenu";
import NotificationModal from "../Modal/NotificationModal";

// Custom hooks
import { useNotificationStatus } from "@/hooks/useNotificationStatus";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-select";
import { Bell, LogOut, Search, Settings, Text, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarItem from "./SidebarItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface NavbarProps {
  users: UserProps[] | undefined;
  user: UserProps | undefined;
  currentUser: currentUserProps | null;
  friend: FriendRequestProps[];
  findSpecificUser: findSpecificUserProps[] | null[];
  yourFriend: findSpecificUserProps[] | null[];
  comment: CommentProps[];
}

const Navbar: React.FC<NavbarProps> = ({
  users,
  user,
  currentUser,
  yourFriend,
  friend,
  findSpecificUser,
  comment,
}) => {
  const { smoothScrollProgress } = useScrollContext();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const [sessionDrop, setSessionDrop] = useState<boolean>(false);
  const [notiDrop, setNotiDrop] = useState<boolean>(false);
  const [currentNav, setCurrentNav] = useState<string>("/");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Update 1
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const outsideRef = useRef(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const { notificationCount, hasUnreadFriends, findRpNoti } =
    useNotificationStatus(friend, currentUser, comment);

  const handleNavbarMouseEnter = useCallback((label: string) => {
    if (label === "Explore") {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setHovered(true);
    }
  }, []);

  const handleNavbarMouseLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      setHovered(false);
    }, 300);
  }, []);

  const handleNavClick = useCallback(() => {
    setSidebarOpen((prev) => !prev); // Update 2
    setNotiDrop(false);
    setSessionDrop(false);
    setShowSearch(false);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleSearchClick = useCallback(() => {
    setShowSearch((prev) => !prev);
    setNotiDrop(false);
    setSessionDrop(false);
    closeSidebar();
  }, [closeSidebar]);

  const handleNotiDropClick = useCallback(() => {
    setNotiDrop((prev) => !prev);
    setSessionDrop(false);
    setShowSearch(false);
    closeSidebar();
  }, [closeSidebar]);

  const handleSessionDropClick = useCallback(() => {
    setSessionDrop((prev) => !prev);
    setNotiDrop(false);
    setShowSearch(false);
    closeSidebar();
  }, [closeSidebar]);

  const handleSearch = useCallback(
    (query: string) => {
      if (query) {
        router.push(`?query=${encodeURIComponent(query)}`);
      }
    },
    [router]
  );

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const overlayVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.3 } },
  };
  const isHomePage = pathname === "/";

  // Use useTransform here, outside of the useEffect
  const opacity = useTransform(smoothScrollProgress, [0, 0.1], [0, 1]);

  const [backgroundColor, setBackgroundColor] = useState("rgba(25, 26, 32, 0)");

  useEffect(() => {
    const unsubscribe = opacity.on("change", (value) => {
      setBackgroundColor(`rgba(25, 26, 32, ${value})`);
    });

    return () => unsubscribe();
  }, [opacity]);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  useOutsideClick(outsideRef, () => {
    if (notiDrop) {
      setNotiDrop(false);
    }
    if (sessionDrop) {
      setSessionDrop(false);
    }
  });
  return (
    <nav className="flex flex-col top-0 sticky z-[9999]">
      <motion.div
        className={`${
          !isHomePage
            ? "!bg-[#191a20] from-transparent to-transparent"
            : "fixed top-0 w-full z-10"
        }`}
        style={{
          backgroundColor: isHomePage ? backgroundColor : undefined,
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <div className="max-w-[1808px] relative flex flex-wrap items-center justify-between mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              name="Hamburgur"
              onClick={handleNavClick}
              className="lg:hidden hover:bg-[#ffffff] hover:bg-opacity-20 p-1 rounded-md"
            >
              <Text className="text-white text-xl md:text-2xl" />
            </button>
            <NavbarLogo setCurrentNav={setCurrentNav} />
            <NavbarItems
              items={navbar_items}
              currentNav={currentNav}
              setCurrentNav={setCurrentNav}
              handleNavbarMouseEnter={handleNavbarMouseEnter}
              handleNavbarMouseLeave={handleNavbarMouseLeave}
            />
          </div>
          <NavbarActions
            showSearch={showSearch}
            handleSearchClick={handleSearchClick}
            handleNotiDropClick={handleNotiDropClick}
            notificationCount={notificationCount}
            hasUnreadFriends={hasUnreadFriends}
            findRpNoti={findRpNoti}
            session={session}
            user={user}
            handleSessionDropClick={handleSessionDropClick}
            sessionItems={sessionItems}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
            sessionDrop={sessionDrop}
            outsideRef={outsideRef}
          />
        </div>

        <NavbarDropdownMenu
          hovered={hovered}
          setHovered={setHovered}
          hoverTimeout={hoverTimeout}
        />

        <AnimatePresence>
          {showSearch && (
            <SearchInput
              onSearch={handleSearch}
              onClose={() => setShowSearch(false)}
            />
          )}
        </AnimatePresence>

        {notiDrop && (
          <NotificationModal
            users={users}
            currentUser={currentUser}
            findSpecificUser={findSpecificUser}
            yourFriend={yourFriend}
            friend={friend}
            comment={comment}
            outsideRef={outsideRef}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-background border-r shadow-lg"
            >
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <NavbarLogo setCurrentNav={setCurrentNav} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {sidebar_items.map((item, index) => (
                      <SidebarItem
                        key={index}
                        item={item}
                        currentNav={currentNav}
                        setCurrentNav={setCurrentNav}
                        closeSidebar={closeSidebar}
                      />
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSearchClick}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={closeSidebar}
                      asChild
                    >
                      <Link href="/notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        <span
                          className={`text-white bg-[#f44455] text-[10px] px-2 py-[1px] rounded-full ml-2`}
                        >
                          {(hasUnreadFriends || findRpNoti) && (
                            <span>
                              {notificationCount > 0 ? notificationCount : null}
                            </span>
                          )}
                        </span>
                      </Link>
                    </Button>
                  </div>
                  {!session && (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={closeSidebar}
                      asChild
                    >
                      <Link href="/signin">Login</Link>
                    </Button>
                  )}
                  {session && (
                    <div className="pt-4">
                      <Separator />
                      <div className="pt-4 space-y-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-2">
                            <AvatarImage
                              src={
                                user?.profileAvatar ||
                                (session?.user?.image as string)
                              }
                            />
                            <AvatarFallback>{user?.name}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user?.displayName || user?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session?.user?.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={closeSidebar}
                          asChild
                        >
                          <Link href={`/profile/${user?.name}`}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={closeSidebar}
                          asChild
                        >
                          <Link href="/setting">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full justify-start"
                          onClick={() => {
                            /* Add logout logic */
                            closeSidebar();
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeSidebar}
            />
          </>
        )}
      </AnimatePresence>
      {/* Update 4 */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween" }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
