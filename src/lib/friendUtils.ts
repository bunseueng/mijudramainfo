export const getUniqueFriends = (friends: any[] = []) => {
    return Array.from(
      new Map(
        friends?.map((friend: any) => [
          friend.friendId || friend.id,
          {
            ...friend,
            // Ensure we have a consistent ID field
            friendId: friend.friendId || friend.id
          }
        ])
      ).values()
    );
  };
  
  export const getPendingFriendRequests = (friends: any[] = [], currentUserId: string) => {
    return friends?.filter(
      (f) =>
        f.status === "pending" &&
        f?.friendRequestId !== currentUserId &&
        f?.friendRespondId === currentUserId
    ) || [];
  };