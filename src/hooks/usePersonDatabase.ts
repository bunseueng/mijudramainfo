import { getPersonData } from "@/app/actions/personActions"
import { useQuery } from "@tanstack/react-query"

export const usePersonDatabase = (person_id: string) => {
    return useQuery({
        queryKey: ['person_database', person_id],
        queryFn: () => getPersonData(person_id),
        enabled: !!person_id, // Only run if name exists
        staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache will be kept for 30 minutes
    }
)
}