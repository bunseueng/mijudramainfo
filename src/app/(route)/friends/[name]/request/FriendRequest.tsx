"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { friendItems } from "@/helper/item-list";
import dynamic from "next/dynamic";
import { useProfileData } from "@/hooks/useProfileData";
import { useState, useEffect } from "react";
import FriendList from "../FriendList";
import { useUserFriendData } from "@/hooks/useUserFriendData";
import { getPendingFriendRequests, getUniqueFriends } from "@/lib/friendUtils";

const AcceptRejectButton = dynamic(
  () => import("@/app/component/ui/Button/AcceptRejectButton"),
  { ssr: false }
);

interface FriendRequestProps {
  name: string;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ name }) => {
  const { data } = useProfileData(name);
  const { user, friend, currentUser } = { ...data };
  const { data: userFriends } = useUserFriendData(user?.id as string);
  const pathname = usePathname();
  const [friendRequests, setFriendRequests] = useState(friend);

  // Update friendRequests when friend data changes
  useEffect(() => {
    setFriendRequests(friend);
  }, [friend]);

  const uniqueFriends = getUniqueFriends(userFriends || []);
  const pendingRequests = getPendingFriendRequests(
    friendRequests,
    currentUser?.id as string
  );

  return (
    <div className="max-w-6xl mx-auto my-10 h-screen">
      <div className="bg-white dark:bg-[#242526] h-[500px] border border-[#d3d3d38c] dark:border-[#00000024] shadow-md border-sm rounded-md">
        <h1 className="text-2xl font-bold px-5 pt-4">Friends</h1>
        <FriendList
          user={user}
          currentUser={currentUser}
          allFriendsCount={uniqueFriends?.length || 0}
          friendRequestCount={pendingRequests?.length || 0}
        />

        <div className="px-4 py-5">
          {pendingRequests?.length && pendingRequests?.length > 0 ? (
            pendingRequests.map((item, idx: number) => (
              <div key={idx} className="flex mt-5 items-center justify-between">
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
                    <h1 className="text-[#2490da] font-bold">{item?.name}</h1>
                    <p>{item?.country}</p>
                  </div>
                </div>
                <AcceptRejectButton
                  setFriendRequests={setFriendRequests}
                  item={item}
                />
              </div>
            ))
          ) : (
            <div className="px-4 py-5 text-center">No friend requests!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
