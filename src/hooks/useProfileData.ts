import { getProfileData } from "@/app/actions/getProfileData"
import { useQuery } from "@tanstack/react-query"

export const useProfileData = (name: string) => {
    return useQuery({
        queryKey: ['profile-data', name],
        queryFn: () => getProfileData(name)
    })
}