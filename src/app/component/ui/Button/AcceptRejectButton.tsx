"use client";

import React from "react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { IFriend } from "@/helper/type";

interface FriendRequestProps {
  item: any;
}

const AcceptRejectButton: React.FC<IFriend & FriendRequestProps> = ({
  friend,
  item,
}) => {
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState(friend);

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
    <div className="flex">
      {" "}
      <button
        className="bg-white dark:bg-[#3a3b3c] border dark:border-[#3e4042] px-4 py-1"
        onClick={() =>
          respondToFriendRequest(item.friendRequestId!, "rejected")
        }
        disabled={loading}
      >
        x
      </button>
      <button
        className="bg-[#b3d8ff] dark:bg-[#202020] border border-[#ecf2ff] dark:border-[#b3d8ff33] px-3 py-1"
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
