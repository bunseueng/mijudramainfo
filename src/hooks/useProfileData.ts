import { getProfileData } from "@/app/actions/getProfileData"
import { useQuery } from "@tanstack/react-query"

export const useProfileData = (name?: string) => {
    return useQuery({
        queryKey: ['profile-data', name],
        queryFn: () => getProfileData(name as string),
        enabled: Boolean(name), // Only run if name exists and is not empty
        staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache will be kept for 30 minutes
        retry: false, // Don't retry on error
    })
}