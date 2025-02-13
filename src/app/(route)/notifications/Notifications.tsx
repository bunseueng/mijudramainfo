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
import { useEffect, useState, useCallback } from "react";
import { FaCheck } from "react-icons/fa6";
import { toast } from "react-toastify";

interface CurrentUser {
  currentUser: currentUserProps | null;
}

const Notifications: React.FC<CurrentUser> = ({ currentUser }) => {
  const { data, refetch } = useProfileData(currentUser?.name as string);
  const [loading, setLoading] = useState<boolean>(false);
  const [localData, setLocalData] = useState(data);

  const users: UserProps[] = localData?.users || [];
  const friends: any[] = localData?.friends || [];
  const friendRequests: FriendRequestProps[] = localData?.friend || [];

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
    (item) => item.status === "accepted" && item.notification === "unread"
  );
  const rejectedRequests = friendRequests.filter(
    (item) => item.status === "rejected" && item.notification === "unread"
  );
  const pendingRequests = friendRequests.filter(
    (item) => item.status === "pending" && item.notification === "unread"
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

  const refreshNotifications = useCallback(async () => {
    const newData = await refetch();
    setLocalData(newData.data);
  }, [refetch]);

  useEffect(() => {
    const loadLocalStorage = () => {
      if (typeof window !== "undefined") {
        const storedValue = localStorage.getItem(
          `notificationsRead_${currentUser?.id}`
        );
        if (storedValue === "true") {
          refreshNotifications();
        }
      }
    };

    loadLocalStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `notificationsRead_${currentUser?.id}`) {
        loadLocalStorage();
        refreshNotifications();
      }
    };

    const handleNotificationUpdate = (
      e: CustomEvent<{ userId: string; status: string }>
    ) => {
      if (e.detail.userId === currentUser?.id) {
        loadLocalStorage();
        refreshNotifications();
      }
    };

    const handleGlobalNotificationUpdate = () => {
      loadLocalStorage();
      refreshNotifications();
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
    const pollInterval = setInterval(refreshNotifications, 30000);

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
  }, [currentUser?.id, refreshNotifications]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

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

  const readFriendNoti = useCallback(
    async (friendRequestId: string) => {
      if (!friendRequestId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/friend/notification`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            friendRequestId,
            notification: "read",
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to mark notifications as read");
        }

        broadcastNotificationUpdate();
        await refreshNotifications();
      } catch (error) {
        console.error("Error marking notifications as read:", error);
        toast.error("Failed to mark notifications as read");
      } finally {
        setLoading(false);
      }
    },
    [refreshNotifications, broadcastNotificationUpdate]
  );

  const handleMarkAsRead = useCallback(async () => {
    const friendRequestIds = status.map((fri) => fri.friendRequestId);
    await Promise.all(
      friendRequestIds.map((id) => readFriendNoti(id as string))
    );
  }, [status, readFriendNoti]);

  const hasUnreadNotifications = status.length > 0;

  return (
    <div className="max-w-6xl mx-auto my-10 min-h-screen px-4 md:px-0">
      <div className="bg-white dark:bg-[#242526] min-h-[500px] border border-[#00000024] dark:border-[#3e4042] shadow-md rounded-lg">
        <div className="flex items-center justify-between p-5 border-b border-[#00000024] dark:border-[#3e4042]">
          <h1 className="text-xl font-bold text-black dark:text-[#ffffffde]">
            All Notifications
          </h1>
          {hasUnreadNotifications && (
            <button
              className="bg-white dark:bg-[#3a3b3c] border border-[#d3d3d38c] dark:border-[#3e4042] hover:bg-neutral-100 dark:hover:bg-opacity-80 py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              onClick={handleMarkAsRead}
              disabled={loading}
            >
              <span className="inline-flex items-center text-black dark:text-[#ffffffde]">
                <FaCheck className="mr-2" />
                <span className="text-sm">
                  {loading ? "Marking as read..." : "Mark all as read"}
                </span>
              </span>
            </button>
          )}
        </div>
        <div className="min-h-[300px]">
          <ul className="divide-y divide-[#78828c11] dark:divide-[#3e4042]">
            {hasUnreadNotifications ? (
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
                      href={`/profile/${user?.name}`}
                      prefetch={false}
                      className="flex items-center hover:bg-slate-50 dark:hover:bg-[#18191a] transform duration-200 p-4"
                    >
                      <Image
                        src={
                          user.profileAvatar ||
                          user.image ||
                          "/default-avatar.png"
                        }
                        alt={`${user.name} profile` || "User Profile"}
                        width={40}
                        height={40}
                        quality={100}
                        className="w-[40px] h-[40px] rounded-full object-cover"
                      />
                      <div className="pl-3 flex-1">
                        <p className="text-black dark:text-[#ffffffde]">
                          <span className="text-[#1675b6] font-medium">
                            {user.name}{" "}
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
                            ? "has sent you a friend request"
                            : isRejected
                            ? "has rejected your friend request"
                            : ""}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {moment(req.actionDatetime).fromNow()}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })
            ) : (
              <div className="text-center py-10 px-4">
                <h1 className="text-black dark:text-[#ffffffde] font-bold mb-6">
                  No Unread Notifications
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You don&apos;t have any unread notifications at the moment
                </p>
                <Link
                  href="/"
                  className="inline-block text-white font-medium bg-[#1675b6] border border-[#1f6fa7] rounded-md py-2 px-6 hover:bg-opacity-90 transition duration-200"
                >
                  Back to Home
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
