import { getExistingRatings } from "@/app/actions/getExistingRatings"
import { useQuery } from "@tanstack/react-query"

export const useExistingRatings = () => {
    return useQuery({
        queryKey: ['existing_ratings'],
        queryFn: () => getExistingRatings(),
    })
}