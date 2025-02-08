import { getDatabase } from "@/app/actions/getDatabase"
import { useQuery } from "@tanstack/react-query"

export const useDatabase = () => {
    return useQuery({
        queryKey: ['database', ],
        queryFn: () => getDatabase(),
        staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache will be kept for 30 minutes
    })
}