import { getUserData } from "@/app/actions/getUserData"
import { useQuery } from "@tanstack/react-query"

export const useUserData = () => {
    return useQuery({
        queryKey: ['user-data'],
        queryFn: getUserData
    })
}