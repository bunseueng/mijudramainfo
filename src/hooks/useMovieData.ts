import { useQuery } from "@tanstack/react-query"
import {
  fetchLanguages,
  fetchMovie,
} from "@/app/actions/fetchMovieApi"

export function useMovieData(movie_id: string) {
    const { data: movie, isLoading,  refetch } = useQuery({
        queryKey: ["movie", movie_id],
        queryFn: () => fetchMovie(movie_id),
        staleTime: 3600000, // Cache data for 1 hour
        refetchOnWindowFocus: true,
        refetchOnMount: true, // Refetch on mount to get the latest data
      });
      const { data: language } = useQuery({
        queryKey: ["movieLanguage", movie_id],
        queryFn: () => fetchLanguages(),
        staleTime: 3600000, // Cache data for 1 hour
        refetchOnWindowFocus: true,
        refetchOnMount: true, // Refetch on mount to get the latest data
      });

  return {
    movie,
    isLoading,
    language,
    refetch
  }
}

