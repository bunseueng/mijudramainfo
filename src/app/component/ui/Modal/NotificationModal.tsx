"use client";

import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import moment from "moment";
import {
  CommentProps,
  currentUserProps,
  findSpecificUserProps,
  FriendRequestProps,
  UserProps,
} from "@/app/helper/type";
import { useQuery } from "@tanstack/react-query";
import { fetchTv } from "@/app/actions/fetchMovieApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Notification {
  users: UserProps[] | undefined;
  currentUser: currentUserProps | null;
  friend: FriendRequestProps[];
  findSpecificUser: findSpecificUserProps[] | null[];
  yourFriend: findSpecificUserProps[] | null[];
  comment: CommentProps[];
}

const NotificationModal: React.FC<Notification> = ({
  users,
  currentUser,
  yourFriend,
  friend,
  findSpecificUser,
  comment,
}) => {
  const router = useRouter();

  const yourFriends = yourFriend?.filter(
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
  const tv_id = comment.map((item) => item.postId);

  const {
    data: allTv,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["allTvShows", tv_id],
    queryFn: () => fetchTv(tv_id.flat()),
  });

  const friendNoti = status.map((fri) => fri?.notification).flat();
  const findReply = comment
    .map((com) =>
      com.replies?.filter((rp: any) => rp?.userId === currentUser?.id)
    )
    .flat();
  const findRpNoti = findReply.map(
    (item: any) => item?.notification === "unread"
  );
  const isRepliedItself = comment
    .map((com) =>
      com.replies?.filter((rp: any) => rp?.repliedUserId === currentUser?.id)
    )
    .flat();
  const hasUnreadReplies = findRpNoti.includes(true);
  // Check if there are any unread friend notifications
  const hasUnreadFriends = friendNoti.includes("unread");

  const readRepliesNoti = async (
    commentIds: string,
    parentIds: string | null
  ) => {
    try {
      const res = await fetch(`/api/tv/${tv_id}/notification`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIds: commentIds,
          parentIds: parentIds || [],
          notification: "read",
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        toast.error("Failed to mark as read");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to mark as read");
    }
  };

  const readFriendNoti = async (friendRequestId: string) => {
    try {
      const res = await fetch(`/api/friend/notification`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendRequestId: friendRequestId,
          notification: "read",
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        toast.error("Failed to mark as read");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAsRead = () => {
    readRepliesNoti(
      comment.map((item) => item.id).flat() as any,
      comment
        .map((item) =>
          item.replies
            ?.filter((r: any) => currentUser?.id === r.userId)
            .map((rp: any) => rp?.id)
        )
        .flat() as any
    );
    readFriendNoti(status.map((fri) => fri.friendRequestId).flat() as any);
  };

  if (isLoading) {
    <div>Fetching...</div>;
  } else if (isError) {
    console.log("Failed to fetch tv");
  }
  if (!currentUser) return null; // If currentUser is null, return null or handle as needed

  return (
    <div className="w-[440px] bg-[#242526] border-2 border-[#3e4042] absolute right-[133px] top-[74px] shadow-md">
      <div className="max-h-[660px] overflow-hidden overflow-y-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/notifications"
            className="text-[#ffffffde] font-bold p-4"
          >
            See All Notifications
          </Link>
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
        {(isRepliedItself?.length < 1 && hasUnreadReplies) ||
        hasUnreadFriends ? (
          <div className="border-t-2 border-t-[#3e4042]">
            {hasUnreadFriends && (
              <>
                {status.map((req, idx) => {
                  const user =
                    req.friendRespondId !== currentUser?.id
                      ? yourFriend.find(
                          (friend) => friend?.id === req.friendRespondId
                        )
                      : findSpecificUser.find(
                          (friend) => friend?.id === req.friendRequestId
                        );
                  if (!user) return null;

                  const isPending = pendingRequests.find(
                    (req) =>
                      req.friendRequestId === user?.id ||
                      req.friendRespondId === user?.id
                  );
                  const isAccepted = acceptedRequests.find(
                    (req) =>
                      req.friendRequestId === user?.id ||
                      req.friendRespondId === user?.id
                  );
                  const isRejected = rejectedRequests.find(
                    (req) =>
                      req.friendRequestId === user?.id ||
                      req.friendRespondId === user?.id
                  );
                  console.log(user);
                  return (
                    <Link
                      href="#"
                      className="flex hover:bg-[#18191a] hover:bg-opacity-70 transform duration-300 py-3 px-4"
                      key={idx}
                    >
                      <Image
                        src={user?.profileAvatar || user?.image || ""}
                        alt={`${user?.name} image`}
                        width={40}
                        height={40}
                        quality={100}
                        className="w-[40px] h-[40px] bg-center bg-cover object-cover rounded-full"
                      />
                      <div className="pl-3">
                        <h1>
                          <span className="text-[#1675b6]">{user?.name} </span>
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
                  );
                })}
              </>
            )}

            {hasUnreadReplies && (
              <>
                {comment.map((commentItem) => {
                  return commentItem.replies
                    ?.filter((rp: any) => rp?.notification !== "read")
                    ?.filter((rp: any) => rp?.userId === currentUser.id)
                    ?.map((reply: any, idx) => {
                      // Step 1: Find the user details based on repliedUserId
                      const user = users?.find(
                        (user: any) => user.id === reply.repliedUserId
                      );
                      if (!user || reply.userId === reply.repliedUserId)
                        return null;

                      const date = reply.createdAt;
                      return (
                        <Link
                          href="#"
                          className="flex hover:bg-[#18191a] hover:bg-opacity-70 transform duration-300 py-3 px-4"
                          key={idx}
                        >
                          <Image
                            src={user.profileAvatar || user.image || ""}
                            alt={`${user.name} image`}
                            width={40}
                            height={40}
                            quality={100}
                            className="w-[40px] h-[40px] bg-center bg-cover object-cover rounded-full"
                          />
                          <div className="pl-3">
                            <div>
                              <span className="text-[#1675b6]">
                                {user.name}{" "}
                              </span>
                              replied to your comment on{" "}
                              <Link
                                href={`/tv/${allTv?.id}`}
                                className="text-[#1675b6]"
                              >
                                {allTv?.name || allTv?.title}
                              </Link>
                            </div>
                            <p>{moment(date).fromNow()}</p>
                          </div>
                        </Link>
                      );
                    });
                })}
              </>
            )}
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
      </div>
    </div>
  );
};

export default NotificationModal;
