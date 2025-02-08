import { getUserData } from "@/app/actions/getUserData"
import { useQuery } from "@tanstack/react-query"

export const useUserData = () => {
    return useQuery({
        queryKey: ['user-data'],
        queryFn: () => getUserData(),
        staleTime: Infinity, // Data won't become stale automatically
        gcTime: 1000 * 60 * 30, // Cache will be kept for 30 minutes
        refetchOnMount: false, // Prevent refetch on component mount
        refetchOnWindowFocus: false, // Prevent refetch on window focus
    })
}