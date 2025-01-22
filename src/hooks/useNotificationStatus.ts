import { useMemo } from 'react';
import { CommentProps, currentUserProps, FriendRequestProps } from "@/helper/type";

export const useNotificationStatus = (
  friend: FriendRequestProps[],
  currentUser: currentUserProps | null,
  comment: CommentProps[]
) => {
  return useMemo(() => {
    const acceptedRequests = friend.filter((item) => item.status === "accepted");
    const rejectedRequests = friend.filter((item) => item.status === "rejected");
    const pendingRequests = friend.filter((item) => item.status === "pending");

    const isPendingReceived = pendingRequests
      .filter((req) => req.friendRespondId === currentUser?.id)
      .filter((req) => req.notification === "unread");

    const isAccepted = acceptedRequests
      .filter(
        (req) =>
          req.friendRequestId === currentUser?.id ||
          req.friendRespondId === currentUser?.id
      )
      .filter((req) => req.notification === "unread");

    const isRejected = rejectedRequests
      .filter(
        (req) =>
          req.friendRequestId === currentUser?.id ||
          req.friendRespondId === currentUser?.id
      )
      .filter((req) => req.notification === "unread");

    const status = [...isPendingReceived, ...isAccepted, ...isRejected];
    status.sort((a: any, b: any) => {
      return (
        new Date(b?.actionDatetime).getTime() -
        new Date(a?.actionDatetime).getTime()
      );
    });

    const friendNoti = status.map((fri) => fri?.notification).flat();

    const findReply = comment
      .map((com) =>
        com.replies?.filter((rp: any) => rp?.userId === currentUser?.id)
      )
      .flat();

    const findRpNoti = findReply.filter(
      (item: any) => item?.notification === "unread"
    ).length;

    const hasUnreadFriends = friendNoti.includes("unread");

    const notificationCount =
      isPendingReceived.length + isAccepted.length + isRejected.length;

    return {
      notificationCount,
      hasUnreadFriends,
      findRpNoti
    };
  }, [friend, currentUser, comment]);
};
