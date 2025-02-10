"use client";

import type {
  currentUserProps,
  FriendRequestProps,
  UserProps,
} from "@/helper/type";
import { useProfileData } from "@/hooks/useProfileData";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

interface CurrentUser {
  currentUser: currentUserProps | null;
}

const Notifications: React.FC<CurrentUser> = ({ currentUser }) => {
  const { data } = useProfileData(currentUser?.name as string);
  const [read, setRead] = useState<boolean>(false);

  const users: UserProps[] = data?.users || [];
  const friends: any[] = data?.friends || [];
  const friendRequests: FriendRequestProps[] = data?.friend || [];

  const findSpecificUser = users.filter((user) =>
    friends.some((friend) => friend?.friendRequestId === user.id)
  );

  const yourFriend = users.filter((user) =>
    friends.some((friend) => friend?.friendRespondId === user.id)
  );

  const yourFriends = yourFriend.filter((item) => item.id !== currentUser?.id);

  const yourSelf = findSpecificUser.filter(
    (item) => item.id !== currentUser?.id
  );

  const acceptedRequests = friendRequests.filter(
    (item) => item.status === "accepted"
  );
  const rejectedRequests = friendRequests.filter(
    (item) => item.status === "rejected"
  );
  const pendingRequests = friendRequests.filter(
    (item) => item.status === "pending"
  );

  const status = [
    ...acceptedRequests,
    ...rejectedRequests,
    ...pendingRequests,
  ].sort(
    (a, b) =>
      new Date(b.actionDatetime).getTime() -
      new Date(a.actionDatetime).getTime()
  );

  useEffect(() => {
    const loadLocalStorage = () => {
      if (typeof window !== "undefined") {
        const storedValue = localStorage.getItem(
          `notificationsRead_${currentUser?.id}`
        );
        setRead(storedValue === "true");
      }
    };

    loadLocalStorage();
  }, [currentUser]);

  const handleMarkAsRead = () => {
    setRead(true);
    localStorage.setItem(`notificationsRead_${currentUser?.id}`, "true");
  };

  return (
    <div className="max-w-6xl mx-auto my-10 h-screen px-4 md:px-0">
      <div className="bg-white dark:bg-[#242526] h-[500px] border-2 border-[#00000024] shadow-md rounded-sm">
        <div className="flex items-center justify-between px-5">
          <h1 className="text-xl font-bold">All Notifications</h1>
          <button
            className="bg-[#3a3b3c] border-2 border-[#3e4042] align-middle my-4 mx-3 py-1 px-3 shadow-sm rounded-md"
            onClick={handleMarkAsRead}
          >
            <span className="inline-flex items-center align-middle text-white">
              <FaCheck className="mr-1" />
              <span className="text-sm text-white">Mark these as read</span>
            </span>
          </button>
        </div>
        <div className="min-h-[300px] px-4 py-1">
          <ul className="clear-both rounded-sm">
            {status.length > 0 ? (
              status.map((req, idx) => {
                const user =
                  req.friendRespondId !== currentUser?.id
                    ? yourFriends.find(
                        (friend) => friend.id === req.friendRespondId
                      )
                    : yourSelf.find(
                        (friend) => friend.id === req.friendRequestId
                      );

                if (!user) return null;

                const isPending = pendingRequests.some(
                  (pendingReq) =>
                    pendingReq.friendRequestId === user.id ||
                    pendingReq.friendRespondId === user.id
                );
                const isAccepted = acceptedRequests.some(
                  (acceptedReq) =>
                    acceptedReq.friendRequestId === user.id ||
                    acceptedReq.friendRespondId === user.id
                );
                const isRejected = rejectedRequests.some(
                  (rejectedReq) =>
                    rejectedReq.friendRequestId === user.id ||
                    rejectedReq.friendRespondId === user.id
                );

                return (
                  <li key={idx}>
                    <Link
                      href={`/friends/${user?.name}`}
                      prefetch={false}
                      className="flex hover:bg-[#18191a] hover:bg-opacity-70 border-t-2 border-x-2 border-t-[#78828c11] border-x-[#78828c11] transform duration-300 py-3 px-4 cursor-pointer"
                    >
                      <Image
                        src={
                          user.profileAvatar ||
                          user.image ||
                          "/default-avatar.png"
                        }
                        alt={`${user.name} image` || "User Profile"}
                        width={40}
                        height={40}
                        quality={100}
                        className="w-[40px] h-[40px] bg-center bg-cover object-cover rounded-full"
                      />
                      <div className="pl-3">
                        <h1>
                          <span className="text-[#1675b6]">{user.name} </span>
                          {yourFriends.includes(user)
                            ? isAccepted
                              ? "has accepted your friend request"
                              : isPending
                              ? "has sent you a friend request"
                              : isRejected
                              ? "has rejected your friend request"
                              : ""
                            : isAccepted || isPending
                            ? "has sent you a friend request"
                            : isRejected
                            ? "has rejected your friend request"
                            : ""}
                        </h1>
                        <p>{moment(req.actionDatetime).fromNow()}</p>
                      </div>
                    </Link>
                  </li>
                );
              })
            ) : (
              <div className="text-center border-t-2 border-t-[#3e4042] py-10 px-4">
                <h1 className="text-[#ffffffde] font-bold mb-6">
                  No Unread Notifications
                </h1>
                <Link
                  href="/notifications"
                  className="text-[#ffffffde] font-bold bg-[#1675b6] border-2 border-[#1f6fa7] rounded-sm py-3 px-5 hover:bg-opacity-80"
                >
                  See Past Notifications
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
