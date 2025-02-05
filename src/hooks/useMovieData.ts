import { useQuery } from "@tanstack/react-query"
import {
  fetchMovie,
} from "@/app/actions/fetchMovieApi"

export function useMovieData(movie_id: string) {
    const { data: movie, isLoading,  refetch } = useQuery({
        queryKey: ["movie", movie_id],
        queryFn: () => fetchMovie(movie_id),
        staleTime: 3600000, // Cache data for 1 hour
        gcTime: 1000 * 60 * 60, // Cache for 1 hour
        refetchOnWindowFocus: false, // Prevent refetch on window focus
        refetchOnReconnect: false, // Prevent refetch on reconnect
        refetchOnMount: false, // Prevent refetch on mount
      });

  return {
    movie,
    isLoading,
    refetch
  }
}

