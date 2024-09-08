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
} from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import { fetchTv } from "@/app/actions/fetchMovieApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const readFriendNoti = async (friendRequestId: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 50,
          duration: 1,
        }}
        className="w-full md:w-[440px] bg-white dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#3e4042] absolute left-0 md:left-auto md:right-[133px] top-[74px] shadow-md"
      >
        <div className="max-h-[660px] overflow-hidden overflow-y-auto">
          <div className="flex items-center justify-between">
            <Link
              href="/notifications"
              className="text-black dark:text-[#ffffffde] font-bold p-4"
            >
              See All Notifications
            </Link>
            <button
              className="bg-white dark:bg-[#3a3b3c] border border-[#d3d3d38c] dark:border-[#3e4042] hover:bg-neutral-400 hover:bg-opacity-40 dark:hover:bg-opacity-50 my-4 mx-3 py-1 px-3 shadow-sm rounded-md"
              onClick={handleMarkAsRead}
            >
              <span className="inline-flex">
                {loading ? (
                  <ClipLoader
                    color="#c3c3c3"
                    loading={loading}
                    size={16}
                    className="mr-1"
                  />
                ) : (
                  <FaCheck className="mr-1" />
                )}
                <span className="text-sm">Mark these as read</span>
              </span>
            </button>
          </div>
          {(isRepliedItself?.length < 1 && hasUnreadReplies) ||
          hasUnreadFriends ? (
            <div className="">
              {hasUnreadFriends && (
                <>
                  {status.map((req, idx) => {
                    const isRequester = req.friendRequestId === currentUser?.id;
                    const isResponder = req.friendRespondId === currentUser?.id;

                    // Find the corresponding user
                    const user = isRequester
                      ? yourFriend.find(
                          (friend) => friend?.id === req.friendRespondId
                        )
                      : findSpecificUser.find(
                          (friend) => friend?.id === req.friendRequestId
                        );

                    if (!user) return null;

                    // Determine the type of request
                    const isPending = pendingRequests.find(
                      (request) =>
                        request.friendRequestId === user?.id ||
                        request.friendRespondId === user?.id
                    );
                    const isAccepted = acceptedRequests.find(
                      (request) =>
                        request.friendRequestId === user?.id ||
                        request.friendRespondId === user?.id
                    );
                    const isRejected = rejectedRequests.find(
                      (request) =>
                        request.friendRequestId === user?.id ||
                        request.friendRespondId === user?.id
                    );

                    // Adjust message based on whether the currentUser is the requester or responder
                    let notificationMessage = null;
                    if (isRequester) {
                      notificationMessage = isAccepted ? (
                        <>
                          <span className="text-[#1675b6]">{user?.name}</span>{" "}
                          has accepted your friend request
                        </>
                      ) : isPending ? (
                        <>
                          You have sent a friend request to{" "}
                          <span className="text-[#1675b6]">{user?.name}</span>
                        </>
                      ) : isRejected ? (
                        <>
                          <span className="text-[#1675b6]">{user?.name}</span>{" "}
                          has rejected your friend request
                        </>
                      ) : null;
                    } else if (isResponder) {
                      notificationMessage = isAccepted ? (
                        <>
                          You have accepted a friend request from{" "}
                          <span className="text-[#1675b6]">{user?.name}</span>
                        </>
                      ) : isPending ? (
                        <>
                          <span className="text-[#1675b6]">{user?.name}</span>{" "}
                          has sent you a friend request
                        </>
                      ) : isRejected ? (
                        <>
                          You have rejected a friend request from{" "}
                          <span className="text-[#1675b6]">{user?.name}</span>
                        </>
                      ) : null;
                    }

                    return (
                      <Link
                        href="#"
                        className="flex border-t border-t-[#78828c21] dark:border-t-[#3e4042] hover:bg-slate-200 dark:hover:bg-[#18191a] hover:bg-opacity-70 transform duration-300 py-3 px-4"
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
                          <h1>{notificationMessage}</h1>
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
                            className="flex border-t border-t-[#78828c21] dark:border-t-[#3e4042] hover:bg-slate-100 dark:hover:bg-[#18191a] hover:bg-opacity-70 transform duration-300 py-3 px-4"
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
            <div className="text-center border-t border-t-[#3e4042] py-10 px-4">
              <h1 className="text-black dark:text-[#ffffffde] font-bold mb-6">
                No Unread Notifications
              </h1>
              <Link
                href="/notifications"
                className="text-[#ffffffde] font-bold bg-[#1675b6] border border-[#1f6fa7] rounded-sm py-3 px-5 hover:bg-opacity-80"
              >
                See Past Notifications
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationModal;
