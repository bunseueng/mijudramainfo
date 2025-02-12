import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { StyledRating } from "@/app/actions/StyleRating"
import { convertToFiveStars } from "@/app/actions/convertToFiveStar"
import { getYearFromDate } from "@/app/actions/getYearFromDate"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import LazyImage from "@/components/ui/lazyimage"
import { useInView } from "react-intersection-observer"
import dynamic from "next/dynamic"
import { spaceToHyphen } from "@/lib/spaceToHyphen"

const PlayTrailer = dynamic(() => import("@/app/(route)/(drama)/drama/top/PlayTrailer"), { ssr: false })

export const NetworkCard = ({ drama, tvDetail, ratings, overallIndex }: any) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  })

  const ratingData = ratings?.[drama.id]
  const averageRating = ratingData?.ratings
    ? ratingData.ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / ratingData.ratings.length
    : 0

  const combinedRating =
    drama.vote_average && averageRating
      ? (drama.vote_average + averageRating) / 2
      : drama.vote_average || averageRating || 0

  return (
    <div ref={ref} className="flex border-2 bg-white dark:bg-[#242424] dark:border-[#272727] rounded-lg p-4 mb-10">
      {inView ? (
        <>
          <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
            <div className="relative">
              <Link prefetch={false} href={`/tv/${drama?.id}-${spaceToHyphen(drama?.name || drama?.title)}`}>
                {drama?.poster_path || drama?.backdrop_path ? (
                  <LazyImage
                    src={`https://image.tmdb.org/t/p/${drama?.poster_path ? "w154" : "w300"}/${
                      drama.poster_path || drama.backdrop_path
                    }`}
                    alt={`${drama?.name || drama?.title}'s Poster` || "Drama Poster"}
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                    priority
                    className="w-full object-cover align-middle overflow-clip"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.avif"
                    alt={drama?.name || drama?.title || "Drama Poster"}
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                    priority
                    className="w-full h-full align-middle overflow-clip"
                  />
                )}
              </Link>
            </div>
          </div>
          <div className="pl-2 md:pl-3 w-[80%]">
            <div className="flex items-center justify-between">
              <Link
                prefetch={false}
                href={`/tv/${drama?.id}-${spaceToHyphen(drama?.name || drama?.title)}`}
                className="text-lg text-sky-700 dark:text-[#2196f3] font-bold"
              >
                {drama?.name || drama?.title}
              </Link>
              <p>#{overallIndex}</p>
            </div>
            <p className="text-slate-400 py-1">
              {getDramaType(drama)}
              <span>
                {" "}
                - {getYearFromDate(drama?.first_air_date || drama?.release_date)}
                {tvDetail?.number_of_episodes ? ", " : ""} {tvDetail?.number_of_episodes}{" "}
                {tvDetail?.number_of_episodes ? "Episodes" : ""}
              </span>
            </p>
            <div className="flex items-center">
              <StyledRating
                name="customized-color"
                value={convertToFiveStars(combinedRating, 10)}
                readOnly
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                precision={0.5}
              />
              <p className="pl-2 pt-1">{combinedRating.toFixed(1)}</p>
            </div>
            <p className="text-md font-semibold line-clamp-3 truncate whitespace-normal my-2">{drama?.overview}</p>
            <div className="flex items-center">
              <Suspense fallback={<div>loading...</div>}>
                <PlayTrailer video={tvDetail?.videos} />
              </Suspense>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[200px] animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}
    </div>
  )
}

const getDramaType = (drama: any) => {
  const { origin_country, genre_ids } = drama
  const country = origin_country?.[0]
  const isDrama =
    !genre_ids?.includes(10764) &&
    !genre_ids?.includes(10767) &&
    !genre_ids?.includes(16) &&
    (genre_ids?.includes(18) || genre_ids?.includes(10765) || genre_ids?.includes(35))
  const isTVShow =
    (genre_ids.includes(10764) || genre_ids.includes(10767)) &&
    !genre_ids?.includes(18) &&
    !genre_ids?.includes(16) &&
    !genre_ids?.includes(10765)
  const isAnime = genre_ids?.includes(16) && !genre_ids?.includes(10764) && !genre_ids?.includes(10767)

  if (isDrama) {
    switch (country) {
      case "CN":
        return "Chinese Drama"
      case "JP":
        return "Japanese Drama"
      case "KR":
        return "Korean Drama"
      case "TW":
        return "Taiwanese Drama"
      case "HK":
        return "Hong Kong Drama"
      case "TH":
        return "Thailand Drama"
      default:
        return "Drama"
    }
  } else if (isTVShow) {
    switch (country) {
      case "CN":
        return "Chinese TV Show"
      case "JP":
        return "Japanese TV Show"
      case "KR":
        return "Korean TV Show"
      default:
        return "TV Show"
    }
  } else if (isAnime) {
    return "Anime"
  }
  return "Other"
}

