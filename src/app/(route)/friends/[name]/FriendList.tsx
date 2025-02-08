"use client";

import { friendItems } from "@/helper/item-list";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FriendListProps {
  user: any;
  currentUser: any;
  allFriendsCount: number;
  friendRequestCount: number;
}

const FriendList: React.FC<FriendListProps> = ({
  user,
  currentUser,
  allFriendsCount,
  friendRequestCount,
}) => {
  const pathname = usePathname();

  return (
    <ul className="inline-block w-full border-b-2 border-b-[#78828c21] -my-4 pb-1 mt-4">
      {friendItems
        ?.filter((item) => {
          // Hide Friend Request and User Search for non-matching users
          if (
            (item.label === "Friend Request" || item.label === "User Search") &&
            currentUser?.name !== user?.name
          ) {
            return false;
          }
          return true;
        })
        ?.map((list: any, idx: number) => {
          // Determine the correct link path
          let linkPath = `${list?.link}/${user?.name}`;
          if (list?.label === "Friend Request") {
            linkPath = `${list?.link}/${user?.name}/request`;
          } else if (list?.label === "User Search") {
            linkPath = `${list?.link}/${user?.name}/search`;
          }

          const isActive = pathname === linkPath;

          return (
            <li
              key={idx}
              id={list.id}
              className={`float-left -mb-1 cursor-pointer hover:border-b-[1px] hover:border-b-[#3f3f3f] hover:pb-[5px] ${
                isActive ? "border-b border-b-[#1d9bf0] pb-1" : ""
              }`}
            >
              <Link
                prefetch={false}
                href={linkPath}
                className="relative text-sm md:text-md font-semibold px-2 md:px-4 py-2"
              >
                {list?.label}
                {list?.label === "All Friends" && (
                  <span className="pl-2">({allFriendsCount})</span>
                )}
                {list?.label === "Friend Request" && (
                  <span className="pl-2">({friendRequestCount})</span>
                )}
              </Link>
            </li>
          );
        })}
    </ul>
  );
};

export default FriendList;
