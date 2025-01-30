"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { friendItems } from "@/helper/item-list";
import { currentUserProps, IFriend, UserProps } from "@/helper/type";
import dynamic from "next/dynamic";
const AcceptRejectButton = dynamic(
  () => import("@/app/component/ui/Button/AcceptRejectButton"),
  { ssr: false }
);

interface currentUser {
  currentUser: currentUserProps | null;
  user: UserProps | null;
}

const FriendRequest: React.FC<IFriend & currentUser> = ({
  user,
  friend,
  currentUser,
}) => {
  const [friendRequests, setFriendRequests] = useState(friend);
  const pathname = usePathname();

  return (
    <div className="max-w-4xl mx-auto my-10 h-screen">
      <div className="bg-white dark:bg-[#242526] h-[500px] border border-[#d3d3d38c] dark:border-[#00000024] shadow-md border-sm rounded-md">
        <h1 className="text-2xl font-bold px-5 pt-4">Friends</h1>
        <ul className="inline-block w-full border-b-2 border-b-[#78828c21] -my-4 pb-1 mt-4">
          {friendItems
            ?.filter((item) => {
              // Conditionally hide "Friend Request" and "User Search" when users don't match
              if (
                (item.label === "Friend Request" ||
                  item.label === "User Search") &&
                currentUser?.name !== user?.name
              ) {
                return false; // Hide these items
              }
              return true; // Show all other items
            })
            ?.map((list: any, idx: number) => {
              // Determine the href based on the label
              let linkPath = `${list?.link}/${user?.name}`;
              if (list?.label === "Friend Request") {
                linkPath = `${list?.link}/${user?.name}/request`;
              } else if (list?.label === "User Search") {
                linkPath = `${list?.link}/${user?.name}/search`;
              }

              // Determine if the current path matches the link
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
                  </Link>
                </li>
              );
            })}
        </ul>

        <div className="px-4 py-5">
          {friendRequests?.length > 0 &&
          friendRequests?.find((item) => item?.status === "pending") ? (
            friendRequests.map((item, idx: number) => (
              <div key={idx}>
                {item.status === "pending" &&
                  item?.friendRequestId !== currentUser?.id &&
                  item?.friendRespondId === currentUser?.id && (
                    <div className="flex mt-5 items-center justify-between">
                      <div className="flex">
                        <Image
                          src={item?.profileAvatar || item?.image}
                          alt={`${item?.name}'s Profile` || "User Profile"}
                          width={100}
                          height={100}
                          quality={100}
                          priority
                          className="w-[50px] h-[50px] bg-center bg-cover object-cover rounded-full"
                        />
                        <div className="pl-3">
                          <h1 className="text-[#2490da] font-bold">
                            {item?.name}
                          </h1>
                          <p>{item?.country}</p>
                        </div>
                      </div>
                      <AcceptRejectButton friend={friend} item={item} />
                    </div>
                  )}
              </div>
            ))
          ) : (
            <div className="px-4 py-5 text-center">No friend request!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
