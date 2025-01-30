import { useQuery } from "@tanstack/react-query"
import {
  fetchTv,
  fetchLanguages,
} from "@/app/actions/fetchMovieApi"

export function useDramaData(tv_id: string) {
    const { data: tv, isLoading, refetch } = useQuery({
        queryKey: ["tv", tv_id, {
          staleTime: 120000,
          cacheTime: 120000,
        }],
        queryFn: () => fetchTv(tv_id),
    });
    
    const { data: language } = useQuery({
        queryKey: ["language", tv_id, {
          staleTime: 120000,
          cacheTime: 120000,
        }],
        queryFn: () => fetchLanguages(),
    });

    return {
        tv,
        isLoading,
        refetch,
        language,
    }
}