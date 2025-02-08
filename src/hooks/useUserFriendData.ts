import { getUserFriends } from "@/app/actions/getUserFriends"
import { useQuery } from "@tanstack/react-query"

export const useUserFriendData = (user_id: string) => {
    return useQuery({
        queryKey: ['user-friend', user_id],
        queryFn: () => getUserFriends(user_id),
        enabled: !!user_id, // Only run if name exists
        staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache will be kept for 30 minutes
    })
}