import { getPersonDetails } from "@/app/actions/personActions"
import { useQuery } from "@tanstack/react-query"

export const usePersonFullDetails = (person_id: string) => {
    return useQuery({
        queryKey: ['person_full_details', person_id],
        queryFn: () => getPersonDetails(person_id),
        enabled: !!person_id, // Only run if name exists
        staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache will be kept for 30 minutes
    })
}