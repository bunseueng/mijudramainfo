"use client";

import {
  currentUserProps,
  IFindSpecificUser,
  IFriend,
} from "@/app/helper/type";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

interface currentUser {
  currentUser: currentUserProps | null;
}

const Notifications: React.FC<IFriend & currentUser & IFindSpecificUser> = ({
  friend,
  currentUser,
  findSpecificUser,
  yourFriend,
}) => {
  const [read, setRead] = useState<boolean>(false);
  const yourFriends = yourFriend?.filter(
    (item) => item?.id !== currentUser?.id
  );

  const yourSelf = findSpecificUser?.filter(
    (item) => item?.id !== currentUser?.id
  );
  const acceptedRequests = friend.filter((item) => item.status === "accepted");
  const rejectedRequests = friend.filter((item) => item.status === "rejected");
  const pendingRequests = friend.filter((item) => item.status === "pending");
  const status = [...acceptedRequests, ...rejectedRequests, ...pendingRequests];

  status.sort((a, b) => {
    return (
      new Date(b.actionDatetime).getTime() -
      new Date(a.actionDatetime).getTime()
    );
  });

  useEffect(() => {
    const loadLocalStorage = async () => {
      if (typeof window !== "undefined") {
        const storedValue = localStorage.getItem(
          `notificationsRead_${currentUser?.id}`
        );
        setRead(storedValue === "true" ? true : false);
      }
    };

    loadLocalStorage();
  }, [currentUser, setRead]);

  const handleMarkAsRead = () => {
    setRead(true);
    localStorage.setItem(`notificationsRead_${currentUser?.id}`, "true");
  };
  return (
    <div className="max-w-4xl mx-auto my-10 h-screen">
      <div className="bg-[#242526] h-[500px] border-2 border-[#00000024] shadow-md border-sm">
        <div className="flex items-center justify-between px-5">
          <h1 className="text-xl font-bold">All Notifications</h1>
          <button
            className="bg-[#3a3b3c] border-2 border-[#3e4042] my-4 mx-3 py-1 px-3 shadow-sm rounded-md"
            onClick={handleMarkAsRead}
          >
            <span className="inline-flex">
              <FaCheck />
              <span className="text-sm">Mark these as read</span>
            </span>
          </button>
        </div>
        <div className="min-h-[300px] px-4 py-1">
          <ul className="clear-both rounded-sm">
            {status.length > 0 ? (
              <div className="">
                {status.map((req, idx) => {
                  const user =
                    req.friendRespondId !== currentUser?.id
                      ? yourFriends.find(
                          (friend) => friend?.id === req.friendRespondId
                        )
                      : yourSelf.find(
                          (friend) => friend?.id === req.friendRequestId
                        );

                  if (!user) return null;

                  const isPending = pendingRequests.find(
                    (req) =>
                      req.friendRequestId === user.id ||
                      req.friendRespondId === user.id
                  );
                  const isAccepted = acceptedRequests.find(
                    (req) =>
                      req.friendRequestId === user.id ||
                      req.friendRespondId === user.id
                  );
                  const isRejected = rejectedRequests.find(
                    (req) =>
                      req.friendRequestId === user.id ||
                      req.friendRespondId === user.id
                  );

                  return (
                    <li key={idx}>
                      <Link
                        href="/friends/request"
                        className="flex hover:bg-[#18191a] hover:bg-opacity-70 border-t-2 border-x-2 border-t-[#78828c11] border-x-[#78828c11] transform duration-300 py-3 px-4 cursor-pointer"
                      >
                        <Image
                          src={user?.profileAvatar || (user?.image as string)}
                          alt={`${user?.name} image`}
                          width={40}
                          height={40}
                          quality={100}
                          className="w-[40px] h-[40px] bg-center bg-cover object-cover rounded-full"
                        />
                        <div className="pl-3">
                          <h1>
                            <span className="text-[#1675b6]">
                              {user?.name}{" "}
                            </span>
                            {yourFriends.includes(user)
                              ? isAccepted
                                ? "has accepted your friend request"
                                : isPending
                                ? "has sent you a friend request"
                                : isRejected
                                ? "has rejected your friend request"
                                : ""
                              : isAccepted || isPending
                              ? "has sending you a friend request"
                              : isRejected
                              ? "has rejected your friend request"
                              : ""}
                          </h1>
                          <p>{moment(req?.actionDatetime).fromNow()}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </div>
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
