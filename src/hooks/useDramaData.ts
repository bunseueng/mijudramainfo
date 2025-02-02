import { useQuery } from "@tanstack/react-query";
import { fetchTv, fetchLanguages } from "@/app/actions/fetchMovieApi";

async function fetchDramaData(tv_id: string) {
  const [tv, language] = await Promise.all([
    fetchTv(tv_id),
    fetchLanguages()
  ]);

  return { tv, language };
}

export function useDramaData(tv_id: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["drama", tv_id],
    queryFn: () => fetchDramaData(tv_id),
    staleTime: Infinity, // Keep data fresh forever
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnReconnect: false, // Prevent refetch on reconnect
    refetchOnMount: false, // Prevent refetch on mount
  });

  return {
    tv: data?.tv,
    language: data?.language,
    isLoading,
    refetch
  };
}