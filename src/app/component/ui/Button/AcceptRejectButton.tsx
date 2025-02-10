"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

interface FriendRequestProps {
  item: any;
  setFriendRequests: Dispatch<
    SetStateAction<
      | {
          friendRequestId: string;
          image: string;
          name: string;
          id: string;
          country: string | null;
          profileAvatar: string | null;
          createdAt: Date;
          updatedAt: Date;
          friendRespondId: string;
          status: string;
          actionDatetime: Date;
          notification: string;
        }[]
      | undefined
    >
  >;
  onActionComplete: () => void;
}

const AcceptRejectButton: React.FC<FriendRequestProps> = ({
  item,
  setFriendRequests,
  onActionComplete,
}) => {
  const [loading, setLoading] = useState(false);

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
          friendRequestId: friendRequestId,
          status: status,
          actionDatetime: new Date(),
        }),
      });

      if (response.ok) {
        // Immediately update the UI by filtering out the responded request
        setFriendRequests((prevState) =>
          prevState?.filter(
            (request) => request.friendRequestId !== friendRequestId
          )
        );

        // Call onActionComplete to trigger data refetch
        onActionComplete();

        toast.success(`Friend request ${status}`);
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
    <div className="flex gap-2">
      <button
        className="bg-white dark:bg-[#3a3b3c] border dark:border-[#3e4042] px-4 py-1 rounded hover:bg-gray-100 dark:hover:bg-[#4a4b4c] transition-colors disabled:opacity-50"
        onClick={() =>
          respondToFriendRequest(item.friendRequestId!, "rejected")
        }
        disabled={loading}
      >
        x
      </button>
      <button
        className="bg-[#b3d8ff] dark:bg-[#202020] border border-[#ecf2ff] dark:border-[#b3d8ff33] px-3 py-1 rounded hover:bg-[#a3c8ff] dark:hover:bg-[#303030] transition-colors disabled:opacity-50"
        onClick={() =>
          respondToFriendRequest(item.friendRequestId!, "accepted")
        }
        disabled={loading}
      >
        <span className="flex items-center text-[#409eff]">
          <FaCheck className="mr-1" /> Accept
        </span>
      </button>
    </div>
  );
};

export default AcceptRejectButton;
