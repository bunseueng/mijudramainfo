import {
    fetchCastCredit,
    fetchContentRating,
    fetchImages,
    fetchKeyword,
    fetchLanguages,
    fetchRecommendation,
    fetchReview,
    fetchTitle,
    fetchTrailer,
    fetchTv,
    fetchVideos,
  } from "@/app/actions/fetchMovieApi";
  
  export const fetchAllDramaData = async (tv_id: string) => {
    const [
      tv,
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
    ] = await Promise.all([
      fetchTv(tv_id),
      fetchTrailer(tv_id),
      fetchCastCredit(tv_id),
      fetchLanguages(),
      fetchContentRating(tv_id),
      fetchKeyword(tv_id),
      fetchTitle(tv_id),
      fetchReview(tv_id),
      fetchImages(tv_id),
      fetchVideos(tv_id),
      fetchRecommendation(tv_id),
      fetchRecommendation
    ]);
  
    return {
      tv,
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
    };
  };