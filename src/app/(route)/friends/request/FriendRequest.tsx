"use client";

// FriendRequest.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { friendItems } from "@/app/helper/item-list";
import { currentUserProps, IFriend } from "@/app/helper/type";

interface currentUser {
  currentUser: currentUserProps | null;
}

const FriendRequest: React.FC<IFriend & currentUser> = ({
  friend,
  currentUser,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState(friend);
  const pathname = usePathname();

  const respondToFriendRequest = async (
    friendRequestId: string,
    status: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/friend/addFriend", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendRequestId: friendRequestId, // Pass friendRequestId
          status: status,
          actionDatetime: new Date(),
        }),
      });
      if (response.ok) {
        // Update only the clicked friend request's status
        setFriendRequests((prevState) =>
          prevState.map((request) =>
            request.friendRequestId === friendRequestId
              ? { ...request, status: status }
              : request
          )
        );
        toast.success("Friend request " + status);
      } else {
        toast.error("Failed to respond to friend request");
      }
    } catch (error) {
      console.error("Error responding to friend request:", error);
      toast.error("Failed to respond to friend request");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto my-10 h-screen">
      <div className="bg-[#242526] h-[500px] border-2 border-[#00000024] shadow-md border-sm">
        <h1 className="text-2xl font-bold px-5 pt-4">Friends</h1>
        <ul className="inline-block w-full border-b-2 border-b-[#78828c21] -my-4 pb-1 mt-4">
          {friendItems?.map((list: any, idx: number) => (
            <li
              key={idx}
              id={list.id}
              className={`float-left -mb-1 cursor-pointer hover:border-b-[1px] hover:border-b-[#3f3f3f] hover:pb-[5px] ${
                pathname === list?.link
                  ? "border-b-2 border-b-[#1d9bf0] pb-1"
                  : ""
              }`}
            >
              <Link
                href={list?.link}
                className="relative text-sm md:text-md font-semibold px-2 md:px-4 py-2"
              >
                {list?.label}
              </Link>
            </li>
          ))}
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
                          alt="profile avatar"
                          width={50}
                          height={50}
                          quality={100}
                          className="w-[50px] h-[50px] bg-center bg-cover object-cover rounded-full"
                        />
                        <div className="pl-3">
                          <h1 className="text-[#2490da] font-bold">
                            {item?.name}
                          </h1>
                          <p>{item?.country}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          className="bg-white dark:bg-[#3a3b3c] border-2 dark:border-[#3e4042] px-4 py-1"
                          onClick={() =>
                            respondToFriendRequest(
                              item.friendRequestId!,
                              "rejected"
                            )
                          }
                          disabled={loading}
                        >
                          x
                        </button>
                        <button
                          className="bg-[#b3d8ff] dark:bg-[#202020] border-2 border-[#ecf2ff] dark:border-[#b3d8ff33] px-3 py-1"
                          onClick={() =>
                            respondToFriendRequest(
                              item.friendRequestId!,
                              "accepted"
                            )
                          }
                          disabled={loading}
                        >
                          <span className="flex items-center text-[#409eff]">
                            <FaCheck className="mr-1" /> Accept
                          </span>
                        </button>
                      </div>
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
