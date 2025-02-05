import type React from "react";
import { useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RiLogoutCircleRLine } from "react-icons/ri";
import type { SessionDropdownProps } from "./NavbarActions";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const SessionDropdown: React.FC<SessionDropdownProps> = ({
  sessionItems,
  resolvedTheme,
  setTheme,
  session,
  outsideRef,
}) => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const handleSignOut = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await signOut({ redirect: false });
        router.push("/");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
    [router]
  );

  if (status === "loading") {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const userName = sessionData?.user?.name || "user";

  return (
    <AnimatePresence>
      <motion.ul
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[300px] h-auto flex flex-col absolute top-[51.5px] right-[20%] bg-white dark:bg-[#242424] rounded-md shadow-md m-0 p-0"
        ref={outsideRef}
      >
        {sessionItems?.map((item: any, idx: number) => (
          <li
            key={idx}
            className="relative hover:bg-[#00000011] transform duration-300 cursor-pointer"
          >
            {item.label === "Dark Mode" ? (
              <button
                name="theme"
                onClick={() =>
                  resolvedTheme === "dark"
                    ? setTheme("light")
                    : setTheme("dark")
                }
                className="w-full flex items-center text-center my-2 ml-2"
              >
                <span className="text-lg">
                  {resolvedTheme === "dark" ? item.iconSun : item.iconMoon}
                </span>
                <span className="text-md ml-2">
                  {resolvedTheme === "dark" ? item.labelLight : item.labelDark}
                </span>
              </button>
            ) : (
              <Link
                prefetch={false}
                href={`${
                  item.link === "/profile" || item.link === "/friends"
                    ? `${item.link}/${userName}`
                    : item.link
                }`}
                className="flex items-center text-center text-[16px] my-2 ml-2"
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            )}
          </li>
        ))}
        <li className="w-full border-b-2 border-b-[#78828c21] dark:border-b-slate-700"></li>
        <li
          className="flex items-center hover:bg-[#00000011] transform duration-300 pl-2 my-2 cursor-pointer"
          onClick={handleSignOut}
        >
          <RiLogoutCircleRLine />
          <span className="ml-2">Sign out</span>
        </li>
      </motion.ul>
    </AnimatePresence>
  );
};

export default SessionDropdown;
