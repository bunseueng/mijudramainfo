import { getCoin } from "@/app/actions/getCoin"
import { useQuery } from "@tanstack/react-query"

export const useCoinData = () => {
    return useQuery({
        queryKey: ['coin'],
        queryFn: () => getCoin(),
        staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache will be kept for 30 minutes
    })
}