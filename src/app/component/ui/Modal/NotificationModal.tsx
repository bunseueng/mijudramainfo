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
import {
  MutableRefObject,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import React from "react";

interface Reply {
  [key: string]: string | number | boolean | null | undefined;
  id: string;
  userId: string;
  repliedUserId: string;
  notification: string;
  createdAt: string;
}

export type CommentWithReplies = Omit<CommentProps, "replies"> & {
  replies?: Reply[];
};

interface Notification {
  users: UserProps[] | undefined;
  currentUser: currentUserProps | null;
  friend: FriendRequestProps[];
  findSpecificUser: findSpecificUserProps[] | null[];
  yourFriend: findSpecificUserProps[] | null[];
  comment: CommentWithReplies[];
  outsideRef: MutableRefObject<HTMLDivElement | null>;
}

const NotificationModal: React.FC<Notification> = ({
  users,
  currentUser,
  yourFriend,
  friend,
  findSpecificUser,
  comment,
  outsideRef,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [localFriend, setLocalFriend] = useState(friend);
  const [localComment, setLocalComment] =
    useState<CommentWithReplies[]>(comment);
  const router = useRouter();

  const checkNotificationStatus = useCallback(() => {
    if (typeof window !== "undefined" && currentUser?.id) {
      const isRead =
        localStorage.getItem(`notificationsRead_${currentUser.id}`) === "true";
      if (isRead) {
        setLocalFriend((prev) =>
          prev.map((friend) => ({ ...friend, notification: "read" }))
        );
        setLocalComment((prev) =>
          prev.map((comment) => ({
            ...comment,
            replies: comment.replies?.map((reply) => ({
              ...reply,
              notification: "read",
            })),
          }))
        );
      }
    }
  }, [currentUser?.id]);

  useEffect(() => {
    checkNotificationStatus();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `notificationsRead_${currentUser?.id}`) {
        checkNotificationStatus();
        router.refresh();
      }
    };

    const handleNotificationUpdate = (
      e: CustomEvent<{ userId: string; status: string }>
    ) => {
      if (e.detail.userId === currentUser?.id) {
        checkNotificationStatus();
        router.refresh();
      }
    };

    const handleGlobalNotificationUpdate = () => {
      checkNotificationStatus();
      router.refresh();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "notificationUpdate",
      handleNotificationUpdate as EventListener
    );
    window.addEventListener(
      "globalNotificationUpdate",
      handleGlobalNotificationUpdate
    );

    // Poll for updates every 30 seconds
    const pollInterval = setInterval(() => {
      checkNotificationStatus();
      router.refresh();
    }, 30000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate as EventListener
      );
      window.removeEventListener(
        "globalNotificationUpdate",
        handleGlobalNotificationUpdate
      );
      clearInterval(pollInterval);
    };
  }, [checkNotificationStatus, currentUser?.id, router]);

  useEffect(() => {
    setLocalFriend(friend);
    setLocalComment(comment);
  }, [friend, comment]);

  const acceptedRequests = useMemo(
    () =>
      localFriend.filter(
        (item) => item.status === "accepted" && item.notification === "unread"
      ),
    [localFriend]
  );

  const rejectedRequests = useMemo(
    () =>
      localFriend.filter(
        (item) => item.status === "rejected" && item.notification === "unread"
      ),
    [localFriend]
  );

  const pendingRequests = useMemo(
    () =>
      localFriend.filter(
        (item) => item.status === "pending" && item.notification === "unread"
      ),
    [localFriend]
  );

  const status = useMemo(
    () =>
      [...acceptedRequests, ...rejectedRequests, ...pendingRequests].sort(
        (a, b) =>
          new Date(b.actionDatetime).getTime() -
          new Date(a.actionDatetime).getTime()
      ),
    [acceptedRequests, rejectedRequests, pendingRequests]
  );

  const tv_id = useMemo(
    () => localComment.map((item) => item.postId),
    [localComment]
  );

  const { data: allTv, refetch } = useQuery({
    queryKey: ["allTvShows", tv_id],
    queryFn: () => fetchTv(tv_id.flat()),
    staleTime: 3600000,
    gcTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const friendNoti = useMemo(
    () => status.map((fri) => fri?.notification).flat(),
    [status]
  );
  const findReply = useMemo(
    () =>
      localComment
        .map((com) =>
          com.replies?.filter((rp) => rp?.userId === currentUser?.id)
        )
        .flat(),
    [localComment, currentUser?.id]
  );

  const findRpNoti = useMemo(
    () => findReply?.map((item) => item?.notification === "unread"),
    [findReply]
  );

  const isRepliedItself = useMemo(
    () =>
      localComment
        .map((com) =>
          com.replies?.filter((rp) => rp?.repliedUserId === currentUser?.id)
        )
        .flat(),
    [localComment, currentUser?.id]
  );

  const hasUnreadReplies = findRpNoti?.includes(true);
  const hasUnreadFriends = friendNoti.includes("unread");

  const broadcastNotificationUpdate = useCallback(() => {
    localStorage.setItem(`notificationsRead_${currentUser?.id}`, "true");

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `notificationsRead_${currentUser?.id}`,
        newValue: "true",
        oldValue: null,
        storageArea: localStorage,
      })
    );

    window.dispatchEvent(
      new CustomEvent("notificationUpdate", {
        detail: { userId: currentUser?.id, status: "read" },
      })
    );

    window.dispatchEvent(new Event("globalNotificationUpdate"));
  }, [currentUser?.id]);

  const readRepliesNoti = useCallback(
    async (commentIds: string, parentIds: string | null) => {
      if (!localComment.length || !tv_id.length) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/tv/${tv_id[0]}/notification`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentIds,
            parentIds: parentIds || [],
            notification: "read",
          }),
        });

        if (!res.ok) throw new Error("Failed to mark notifications as read");

        setLocalComment((prev) =>
          prev.map((comment) => ({
            ...comment,
            replies: comment.replies?.map((reply) => ({
              ...reply,
              notification: "read",
            })),
          }))
        );

        broadcastNotificationUpdate();
        router.refresh();
      } catch (error) {
        console.error("Error marking notifications as read:", error);
        toast.error("Failed to mark notifications as read");
      } finally {
        setLoading(false);
      }
    },
    [localComment, tv_id, broadcastNotificationUpdate, router]
  );

  const readFriendNoti = useCallback(
    async (friendRequestId: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/friend/notification`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            friendRequestId,
            notification: "read",
          }),
        });

        if (!res.ok) throw new Error("Failed to mark notifications as read");

        setLocalFriend((prev) =>
          prev.map((friend) => ({
            ...friend,
            notification: "read",
          }))
        );

        broadcastNotificationUpdate();
        router.refresh();
      } catch (error) {
        console.error("Error marking notifications as read:", error);
        toast.error("Failed to mark notifications as read");
      } finally {
        setLoading(false);
      }
    },
    [broadcastNotificationUpdate, router]
  );

  const handleMarkAsRead = useCallback(() => {
    const commentIds = localComment.map((item) => item.id).flat();
    const replyIds = localComment
      .map((item) =>
        item.replies
          ?.filter((r) => currentUser?.id === r.userId)
          .map((rp) => rp?.id)
      )
      .flat();
    const friendRequestIds = status.map((fri) => fri.friendRequestId).flat();

    Promise.all([
      readRepliesNoti(commentIds as any, replyIds as any),
      readFriendNoti(friendRequestIds as any),
    ]);
  }, [localComment, currentUser?.id, readRepliesNoti, readFriendNoti, status]);

  useEffect(() => {
    refetch();
  }, [refetch]);
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
        className="w-auto md:w-[440px] bg-white dark:bg-[#242526] border border-[#d3d3d38c] dark:border-[#3e4042] absolute right-2 md:left-auto md:right-[133px] top-[59px] shadow-md"
        ref={outsideRef}
      >
        <div className="max-h-[660px] overflow-hidden overflow-y-auto">
          <div className="flex items-center justify-between">
            <Link
              prefetch={false}
              href="/notifications"
              className="text-sm md:text-base text-black dark:text-[#ffffffde] font-bold p-4"
            >
              See All Notifications
            </Link>
            {(hasUnreadReplies || hasUnreadFriends) && (
              <button
                className="bg-white dark:bg-[#3a3b3c] border border-[#d3d3d38c] dark:border-[#3e4042] hover:bg-neutral-400 hover:bg-opacity-40 dark:hover:bg-opacity-50 my-4 mx-3 py-1 px-3 shadow-sm rounded-md"
                onClick={handleMarkAsRead}
                disabled={loading}
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
            )}
          </div>
          {(isRepliedItself?.length < 1 && hasUnreadReplies) ||
          hasUnreadFriends ? (
            <>
              {hasUnreadFriends && (
                <>
                  {status.map((req, idx) => {
                    const isRequester = req.friendRequestId === currentUser?.id;
                    const isResponder = req.friendRespondId === currentUser?.id;

                    if (
                      isRequester &&
                      pendingRequests.find(
                        (request) =>
                          request.friendRequestId !== req.friendRespondId
                      )
                    ) {
                      return (
                        <div
                          className="text-center border-t border-t-[#3e4042] py-10 px-4"
                          key={req?.id}
                        >
                          <h1 className="text-black dark:text-[#ffffffde] font-bold mb-6">
                            No Unread Notifications
                          </h1>
                          <Link
                            prefetch={false}
                            href="/notifications"
                            className="text-[#ffffffde] font-bold bg-[#1675b6] border border-[#1f6fa7] rounded-sm py-3 px-5 hover:bg-opacity-80"
                          >
                            See Past Notifications
                          </Link>
                        </div>
                      );
                    }

                    const user = isRequester
                      ? yourFriend.find(
                          (friend) => friend?.id === req.friendRespondId
                        )
                      : findSpecificUser.find(
                          (friend) => friend?.id === req.friendRequestId
                        );

                    if (!user) return null;

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

                    let notificationMessage = null;
                    if (isRequester) {
                      notificationMessage = isAccepted ? (
                        <>
                          <span className="text-[#1675b6]">{user?.name}</span>{" "}
                          has accepted your friend request
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
                        prefetch={false}
                        href={`/profile/${user?.name}`}
                        className="flex border-t border-t-[#78828c21] dark:border-t-[#3e4042] hover:bg-slate-200 dark:hover:bg-[#18191a] hover:bg-opacity-70 transform duration-300 py-3 px-4"
                        key={idx}
                      >
                        <Image
                          src={user?.profileAvatar || user?.image || ""}
                          alt={`${user?.name} Profile` || "User Profile"}
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
                  {localComment.map((commentItem) => {
                    return commentItem.replies
                      ?.filter((rp) => rp?.notification !== "read")
                      ?.filter((rp) => rp?.userId === currentUser?.id)
                      ?.map((reply, idx) => {
                        const user = users?.find(
                          (user) => user.id === reply.repliedUserId
                        );
                        if (!user || reply.userId === reply.repliedUserId)
                          return null;

                        const date = reply.createdAt;
                        return (
                          <Link
                            href={`/tv/${allTv?.id}`}
                            className="flex border-t border-t-[#78828c21] dark:border-t-[#3e4042] hover:bg-slate-100 dark:hover:bg-[#18191a] hover:bg-opacity-70 transform duration-300 py-3 px-4"
                            key={idx}
                          >
                            <Image
                              src={user.profileAvatar || user.image || ""}
                              alt={`${user.name} Profile` || "User Profile"}
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
            </>
          ) : (
            <div className="text-center border-t border-t-[#3e4042] py-10 px-4">
              <h1 className="text-black dark:text-[#ffffffde] font-bold mb-6">
                No Unread Notifications
              </h1>
              <Link
                prefetch={false}
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
