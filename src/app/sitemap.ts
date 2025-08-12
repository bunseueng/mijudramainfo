import type { TVShow, PersonType } from "@/helper/type"
import { safelyFormatDate } from "@/lib/safetyDate"
import { spaceToHyphen } from "@/lib/spaceToHyphen"
import type { MetadataRoute } from "next"
export const dynamic = 'force-dynamic'

const MAX_RETRIES = 3;
const BATCH_SIZE = 5;
const MAX_PAGES = 20;

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

async function processBatch<T, R>(
  items: T[],
  processItem: (item: T) => Promise<R>,
  batchSize = BATCH_SIZE
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(processItem)
    );
    results.push(...batchResults);
  }
  
  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || `${process.env.BASE_URL}`
  const sitemapEntries: MetadataRoute.Sitemap = []

  try {
    // Add static pages first for faster initial response
    sitemapEntries.push(...generateStaticPageEntries(baseUrl))

    // Process dynamic entries in parallel with proper error handling
    const results = await Promise.allSettled([
      generateTVShowEntries(baseUrl, sitemapEntries),
      generateMovieEntries(baseUrl, sitemapEntries),
      generatePersonEntries(baseUrl, sitemapEntries),
      generateKoreanTVShowEntries(baseUrl, sitemapEntries),
      generatePopularPersonEntries(baseUrl, sitemapEntries),
      generateNetworkEntry(baseUrl, sitemapEntries),
      generateTvGenresEntries(baseUrl, sitemapEntries),
      generateMovieGenresEntries(baseUrl, sitemapEntries),
    ])

    // Log any errors that occurred during generation
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Error in task ${index}:`, result.reason)
      }
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
  }

  return sitemapEntries
}

async function fetchTVShows(): Promise<TVShow[]> {
  let allTVShows: TVShow[] = [];
  let page = 1;

  try {
    while (page <= MAX_PAGES) {
      const response = await fetchWithRetry(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_origin_country=CN&without_genres=16,10764,10767,99`
      );
      
      const data = await response.json();
      if (!data.results?.length) break;
      
      allTVShows.push(...data.results);
      if (page >= Math.min(data.total_pages, MAX_PAGES)) break;
      
      page++;
    }
    return allTVShows;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
}

async function fetchKoreanTVShows(): Promise<TVShow[]> {
  let allKoreanTv: TVShow[] = [];
  let page = 1;

  try {
    while (page <= MAX_PAGES) {
      const response = await fetchWithRetry(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_origin_country=KR&without_genres=16,10764,10767,99`
      );
      
      const data = await response.json();
      if (!data.results?.length) break;
      
      allKoreanTv.push(...data.results);
      if (page >= Math.min(data.total_pages, MAX_PAGES)) break;
      
      page++;
    }
    return allKoreanTv;
  } catch (error) {
    console.error('Error fetching Korean TV shows:', error);
    return [];
  }
}

async function fetchMovies(): Promise<TVShow[]> {
  let allMovies: TVShow[] = [];
  let page = 1;

  try {
    while (page <= MAX_PAGES) {
      const response = await fetchWithRetry(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_origin_country=CN`
      );
      
      const data = await response.json();
      if (!data.results?.length) break;
      
      allMovies.push(...data.results);
      if (page >= Math.min(data.total_pages, MAX_PAGES)) break;
      
      page++;
    }
    return allMovies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

async function fetchPersons(): Promise<PersonType[]> {
  let allPersons: PersonType[] = [];
  let page = 1;

  try {
    while (page <= MAX_PAGES) {
      const response = await fetchWithRetry(
        `https://api.themoviedb.org/3/trending/person/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${page}`
      );
      
      const data = await response.json();
      if (!data.results?.length) break;
      
      allPersons.push(...data.results);
      if (page >= Math.min(data.total_pages, MAX_PAGES)) break;
      
      page++;
    }
    return allPersons;
  } catch (error) {
    console.error('Error fetching persons:', error);
    return [];
  }
}

async function fetchPopularPersons(): Promise<PersonType[]> {
  let allPersons: PersonType[] = [];
  let page = 1;

  try {
    while (page <= MAX_PAGES) {
      const response = await fetchWithRetry(
        `https://api.themoviedb.org/3/person/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${page}`
      );
      
      const data = await response.json();
      if (!data.results?.length) break;
      
      allPersons.push(...data.results);
      if (page >= Math.min(data.total_pages, MAX_PAGES)) break;
      
      page++;
    }
    return allPersons;
  } catch (error) {
    console.error('Error fetching popular persons:', error);
    return [];
  }
}

async function generateTVShowEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const tvShows = await fetchTVShows()
    sitemapEntries.push(
      ...tvShows.flatMap((tvShow) => [
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 1.0,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/watch`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 1.0,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/photos`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.8,
          changeFrequency: "weekly" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/reviews`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.6,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/seasons`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.6,
          changeFrequency: "weekly" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/cast`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.7,
          changeFrequency: "monthly" as const,
        },
      ])
    )
    await generateTVKeywordEntries(tvShows, baseUrl, sitemapEntries)
    await generateTvCastEntries(tvShows, baseUrl, sitemapEntries)
  } catch (error) {
    console.error("Error generating TV show entries:", error)
  }
}

async function generateKoreanTVShowEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const tvShows = await fetchKoreanTVShows()
    sitemapEntries.push(
      ...tvShows.flatMap((tvShow) => [
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 1.0,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/watch`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 1.0,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/photos`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.8,
          changeFrequency: "weekly" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/reviews`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.6,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/seasons`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.6,
          changeFrequency: "weekly" as const,
        },
        {
          url: `${baseUrl}/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}/cast`,
          lastModified: safelyFormatDate(tvShow.last_air_date || tvShow.first_air_date),
          priority: 0.7,
          changeFrequency: "monthly" as const,
        },
      ])
    )
    await generateTVKeywordEntries(tvShows, baseUrl, sitemapEntries)
    await generateTvCastEntries(tvShows, baseUrl, sitemapEntries)
  } catch (error) {
    console.error("Error generating Korean TV show entries:", error)
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
          priority: 1.0,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/movie/${movie.id}-${spaceToHyphen(movie.title)}/watch`,
          lastModified: safelyFormatDate(movie.release_date),
          priority: 1.0,
          changeFrequency: "daily" as const,
        },
        {
          url: `${baseUrl}/movie/${movie.id}-${spaceToHyphen(movie.title)}/cast`,
          lastModified: safelyFormatDate(movie.release_date),
          priority: 0.6,
          changeFrequency: "monthly" as const,
        },
        {
          url: `${baseUrl}/movie/${movie.id}-${spaceToHyphen(movie.title)}/photos`,
          lastModified: safelyFormatDate(movie.release_date),
          priority: 0.8,
          changeFrequency: "weekly" as const,
        },
      ])
    )
    await generateMovieKeywordEntries(movies, baseUrl, sitemapEntries)
    await generateMovieCastEntries(movies, baseUrl, sitemapEntries)
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
        priority: 1.0,
        changeFrequency: "weekly" as const,
      }))
    )
  } catch (error) {
    console.error("Error generating person entries:", error)
  }
}

async function generatePopularPersonEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const persons = await fetchPopularPersons()
    sitemapEntries.push(
      ...persons.map((person) => ({
        url: `${baseUrl}/person/${person.id}-${spaceToHyphen(person.name)}`,
        lastModified: new Date().toISOString(),
        priority: 1.0,
        changeFrequency: "weekly" as const,
      }))
    )
  } catch (error) {
    console.error("Error generating popular person entries:", error)
  }
}

async function generateTvCastEntries(tvShows: TVShow[], baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const castResults = await processBatch(
      tvShows,
      async (show) => {
        try {
          const response = await fetchWithRetry(
            `https://api.themoviedb.org/3/tv/${show.id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          const data = await response.json();
          return data.cast || [];
        } catch (error) {
          console.error(`Error fetching cast for show ${show.id}:`, error);
          return [];
        }
      }
    );

    const casts = castResults.flat();
    sitemapEntries.push(
      ...casts.map((cast: any) => ({
        url: `${baseUrl}/person/${cast.id}-${spaceToHyphen(cast.name)}`,
        lastModified: new Date().toISOString(),
        priority: 1.0,
        changeFrequency: "monthly" as const,
      }))
    );
  } catch (error) {
    console.error('Error generating TV cast entries:', error);
  }
}

async function generateMovieCastEntries(movies: TVShow[], baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const castResults = await processBatch(
      movies,
      async (movie) => {
        try {
          const response = await fetchWithRetry(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          const data = await response.json();
          return data.cast || [];
        } catch (error) {
          console.error(`Error fetching cast for movie ${movie.id}:`, error);
          return [];
        }
      }
    );

    const casts = castResults.flat();
    sitemapEntries.push(
      ...casts.map((cast: any) => ({
        url: `${baseUrl}/person/${cast.id}-${spaceToHyphen(cast.name)}`,
        lastModified: new Date().toISOString(),
        priority: 1.0,
        changeFrequency: "monthly" as const,
      }))
    );
  } catch (error) {
    console.error('Error generating movie cast entries:', error);
  }
}

async function generateNetworkEntry(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const response = await fetchWithRetry(
      `https://api.themoviedb.org/3/network/2007?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    );
    const network = await response.json();
    
    if (network) {
      sitemapEntries.push({
        url: `${baseUrl}/network/${network.id}`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
        changeFrequency: "monthly" as const,
      });
    }
  } catch (error) {
    console.error("Error generating network entry:", error);
  }
}

async function generateTVKeywordEntries(tvShows: TVShow[], baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const keywordResults = await processBatch(
      tvShows,
      async (show) => {
        try {
          const response = await fetchWithRetry(
            `https://api.themoviedb.org/3/tv/${show.id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          const data = await response.json();
          return data.results || [];
        } catch (error) {
          console.error(`Error fetching keywords for show ${show.id}:`, error);
          return [];
        }
      }
    );

    const keywords = keywordResults.flat();
    sitemapEntries.push(
      ...keywords.map((keyword: any) => ({
        url: `${baseUrl}/keyword/${keyword.id}/tv`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
        changeFrequency: "monthly" as const,
      }))
    );
  } catch (error) {
    console.error('Error generating TV keyword entries:', error);
  }
}

async function generateMovieKeywordEntries(movies: TVShow[], baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const keywordResults = await processBatch(
      movies,
      async (movie) => {
        try {
          const response = await fetchWithRetry(
            `https://api.themoviedb.org/3/movie/${movie.id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          const data = await response.json();
          return data.keywords || [];
        } catch (error) {
          console.error(`Error fetching keywords for movie ${movie.id}:`, error);
          return [];
        }
      }
    );

    const keywords = keywordResults.flat();
    sitemapEntries.push(
      ...keywords.map((keyword: any) => ({
        url: `${baseUrl}/keyword/${keyword.id}/movie`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
        changeFrequency: "monthly" as const,
      }))
    );
  } catch (error) {
    console.error('Error generating movie keyword entries:', error);
  }
}

async function generateTvGenresEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const response = await fetchWithRetry(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    );
    const data = await response.json();
    const genres = data.genres || [];

    sitemapEntries.push(
      ...genres.map((genre: any) => ({
        url: `${baseUrl}/genre/${genre.id}-${spaceToHyphen(genre.name)}/tv`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
        changeFrequency: "monthly" as const,
      }))
    );
  } catch (error) {
    console.error('Error generating TV genre entries:', error);
  }
}

async function generateMovieGenresEntries(baseUrl: string, sitemapEntries: MetadataRoute.Sitemap) {
  try {
    const response = await fetchWithRetry(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    );
    const data = await response.json();
    const genres = data.genres || [];

    sitemapEntries.push(
      ...genres.map((genre: any) => ({
        url: `${baseUrl}/genre/${genre.id}-${spaceToHyphen(genre.name)}/movie`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
        changeFrequency: "monthly" as const,
      }))
    );
  } catch (error) {
    console.error('Error generating movie genre entries:', error);
  }
}

function generateStaticPageEntries(baseUrl: string): MetadataRoute.Sitemap {
  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/watch/tv", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/watch/movie", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/watch/anime", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/drama/newest", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/drama/top", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/drama/upcoming", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/drama/top_chinese_dramas", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/drama/top_korean_dramas", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/drama/top_japanese_dramas", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/movie/newest", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/movie/top", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/movie/upcoming", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/shows/variety", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/people/top", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/coin", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/signin", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/signup", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/about", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
  ]

  return staticPages.map(({ url, priority, changeFrequency }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date().toISOString(),
    priority,
    changeFrequency,
  }))
}