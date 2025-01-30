import { useQuery } from "@tanstack/react-query"
import {
  fetchLanguages,
  fetchPerson,
} from "@/app/actions/fetchMovieApi"

export function usePersonData(person_id: string) {
    const { data: person, isLoading, refetch } = useQuery({
        queryKey: ["tv", person_id, {
          staleTime: 120000,
          cacheTime: 120000,
        }],
        queryFn: () => fetchPerson(person_id),
    });
    
    const { data: language } = useQuery({
        queryKey: ["language", person_id, {
          staleTime: 120000,
          cacheTime: 120000,
        }],
        queryFn: () => fetchLanguages(),
    });

    return {
        person,
        isLoading,
        refetch,
        language,
    }
}