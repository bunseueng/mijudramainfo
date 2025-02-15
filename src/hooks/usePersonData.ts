import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";

export function usePersonData(person_id: string) {
  const {
    data: person,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["person", person_id],
    queryFn: () => fetchPerson(person_id),
    staleTime: 3600000, // 1 hour
    gcTime: 3600000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    person,
    isLoading,
    refetch,
  };
}
