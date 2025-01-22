import { useQuery } from "@tanstack/react-query"
import {
  fetchTv,
  fetchTrailer,
  fetchCastCredit,
  fetchLanguages,
  fetchContentRating,
  fetchKeyword,
  fetchTitle,
  fetchReview,
  fetchImages,
  fetchVideos,
  fetchRecommendation,
} from "@/app/actions/fetchMovieApi"

export function useDramaData(tv_id: string) {
    const { data: tv, isLoading } = useQuery({
        queryKey: ["tv", tv_id],
        queryFn: () => fetchTv(tv_id),
        staleTime: 3600000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      });
    
      const { data: trailer } = useQuery({
        queryKey: ["trailer", tv_id],
        queryFn: () => fetchTrailer(tv_id),
        staleTime: 3600000,
      });
    
      const { data: cast } = useQuery({
        queryKey: ["cast", tv_id],
        queryFn: () => fetchCastCredit(tv_id),
        staleTime: 3600000,
      });
    
      const { data: language } = useQuery({
        queryKey: ["language", tv_id],
        queryFn: () => fetchLanguages(),
        staleTime: 3600000,
      });
    
      const { data: content } = useQuery({
        queryKey: ["content", tv_id],
        queryFn: () => fetchContentRating(tv_id),
        staleTime: 3600000,
      });
    
      const { data: keyword } = useQuery({
        queryKey: ["keyword", tv_id],
        queryFn: () => fetchKeyword(tv_id),
        staleTime: 3600000,
      });
    
      const { data: title } = useQuery({
        queryKey: ["title", tv_id],
        queryFn: () => fetchTitle(tv_id),
        staleTime: 3600000,
      });
    
      const { data: review } = useQuery({
        queryKey: ["review", tv_id],
        queryFn: () => fetchReview(tv_id),
        staleTime: 3600000,
      });
    
      const { data: image } = useQuery({
        queryKey: ["image", tv_id],
        queryFn: () => fetchImages(tv_id),
        staleTime: 3600000,
      });
    
      const { data: video } = useQuery({
        queryKey: ["video", tv_id],
        queryFn: () => fetchVideos(tv_id),
        staleTime: 3600000,
      });
    
      const { data: recommend } = useQuery({
        queryKey: ["recommend", tv_id],
        queryFn: () => fetchRecommendation(tv_id),
        staleTime: 3600000,
      });
    
      const { data: allTvShows } = useQuery({
        queryKey: ["allTvShows", tv_id],
        queryFn: fetchRecommendation,
        staleTime: 3600000,
      });

  return {
    tv,
    isLoading,
    trailer,
    cast,
    language,
    content,
    keyword,
    title,
    review,
    image,
    video,
    recommend,
    allTvShows
  }
}

