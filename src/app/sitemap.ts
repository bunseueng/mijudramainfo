import type { TVShow, PersonType } from "@/helper/type"
import { safelyFormatDate } from "@/lib/safetyDate"
import { spaceToHyphen } from "@/lib/spaceToHyphen"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || "https://mijudramainfo.vercel.app"
  const sitemapEntries: MetadataRoute.Sitemap = []

  try {
    sitemapEntries.push(...generateStaticPageEntries(baseUrl))

    await Promise.all([
      generateTVShowEntries(baseUrl, sitemapEntries),
      generateMovieEntries(baseUrl, sitemapEntries),
      generatePersonEntries(baseUrl, sitemapEntries),
      generateNetworkEntry(baseUrl, sitemapEntries),
    ])
  } catch (error) {
    console.error("Error generating sitemap:", error)
  }

  return sitemapEntries
}

async function generateTVShowEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const tvShows = await fetchTVShows()
    sitemapEntries.push(
      ...tvShows.flatMap((tvShow) => [
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/photos`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/media`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/reviews`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/seasons`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/cast`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
        },
      ]),
    )
    await generateTVKeywordEntries(tvShows, baseUrl, sitemapEntries)
  } catch (error) {
    console.error("Error generating TV show entries:", error)
  }
}

async function generateMovieEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const movies = await fetchMovies()
    sitemapEntries.push(
      ...movies.flatMap((movie) => [
        {
          url: `${baseUrl}/movie/${movie.id}-${spaceToHyphen(movie.title)}`,
          lastModified: safelyFormatDate(movie.release_date),
        },
        {
          url: `${baseUrl}/movie/${movie.id}-${spaceToHyphen(movie.title)}/cast`,
          lastModified: safelyFormatDate(movie.release_date),
        },
        {
          url: `${baseUrl}/movie/${movie.id}-${spaceToHyphen(movie.title)}/photos`,
          lastModified: safelyFormatDate(movie.release_date),
        },
      ]),
    )
    await generateMovieKeywordEntries(movies, baseUrl, sitemapEntries)
  } catch (error) {
    console.error("Error generating movie entries:", error)
  }
}

async function generatePersonEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const persons = await fetchPersons()
    sitemapEntries.push(
      ...persons.map((person) => ({
        url: `${baseUrl}/person/${person.id}-${spaceToHyphen(person.name)}`,
        lastModified: new Date().toISOString(),
      })),
    )
  } catch (error) {
    console.error("Error generating person entries:", error)
  }
}

async function generateNetworkEntry(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const network = await fetchNetwork()
    if (network) {
      sitemapEntries.push({
        url: `${baseUrl}/network/${network.id}`,
        lastModified: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error generating network entry:", error)
  }
}

async function fetchTVShows(): Promise<TVShow[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN&without_genres=16,10764,10767,99`,
  )
  if (!response.ok) throw new Error("Failed to fetch TV shows")
  const data = await response.json()
  return data.results
}

async function fetchMovies(): Promise<TVShow[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN`,
  )
  if (!response.ok) throw new Error("Failed to fetch movies")
  const data = await response.json()
  return data.results
}

async function fetchPersons(): Promise<PersonType[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/person/day?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`,
  )
  if (!response.ok) throw new Error("Failed to fetch persons")
  const data = await response.json()
  return data.results
}

async function fetchNetwork(): Promise<any> {
  const response = await fetch(
    `https://api.themoviedb.org/3/network/2007?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`,
  )
  if (!response.ok) throw new Error("Failed to fetch network")
  return response.json()
}

async function generateTVKeywordEntries(tvShows: TVShow[], baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  const keywordPromises = tvShows.map(async (show) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${show.id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}`,
      )
      if (!response.ok) throw new Error(`Failed to fetch keywords for TV show with id ${show.id}`)
      const data = await response.json()
      return data.results
    } catch (error) {
      console.error(`Error fetching keywords for TV show ${show.id}:`, error)
      return []
    }
  })

  const keywords = (await Promise.all(keywordPromises)).flat()
  sitemapEntries.push(
    ...keywords.map((keyword: any) => ({
      url: `${baseUrl}/keyword/${keyword.id}/tv`,
      lastModified: new Date().toISOString(),
    })),
  )
}

async function generateMovieKeywordEntries(
  movies: TVShow[],
  baseUrl: string,
  sitemapEntries: MetadataRoute.Sitemap,
) {
  const keywordPromises = movies.map(async (movie) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}`,
      )
      if (!response.ok) throw new Error(`Failed to fetch keywords for movie with id ${movie.id}`)
      const data = await response.json()
      return data.keywords
    } catch (error) {
      console.error(`Error fetching keywords for movie ${movie.id}:`, error)
      return []
    }
  })

  const keywords = (await Promise.all(keywordPromises)).flat()
  sitemapEntries.push(
    ...keywords.map((keyword: any) => ({
      url: `${baseUrl}/keyword/${keyword.id}/movie`,
      lastModified: new Date().toISOString(),
    })),
  )
}

function generateStaticPageEntries(baseUrl: string): MetadataRoute.Sitemap {
  const staticPages = [
    { url: "/", },
    { url: "/drama/newest",},
    { url: "/drama/top",},
    { url: "/drama/upcoming",},
    { url: "/drama/top_chinese_dramas",  },
    { url: "/drama/top_korean_dramas",  },
    { url: "/drama/top_japanese_dramas",  },
    { url: "/movie/newest",},
    { url: "/movie/top",},
    { url: "/movie/upcoming",},
    { url: "/shows/variety",  },
    { url: "/people/top",  },
    { url: "/coin", },
    { url: "/signin", },
    { url: "/signup", },
    { url: "/faq", },
    { url: "/about", },
    { url: "/contact", },
    { url: "/terms", },
  ]

  return staticPages.map(({ url }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date().toISOString(),
  }))
}

