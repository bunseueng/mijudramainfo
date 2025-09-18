const { safelyFormatDate } = require("./src/lib/safetyDate");
const { spaceToHyphen } = require("./src/lib/spaceToHyphen");

const MAX_RETRIES = 3;
const BATCH_SIZE = 5;
const MAX_PAGES = 20;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
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

async function processBatch(items, processItem, batchSize = BATCH_SIZE) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processItem));
    results.push(...batchResults);
  }

  return results;
}

async function fetchTVShows() {
  let allTVShows = [];
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
    console.error("Error fetching TV shows:", error);
    return [];
  }
}

async function fetchKoreanTVShows() {
  let allKoreanTv = [];
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
    console.error("Error fetching Korean TV shows:", error);
    return [];
  }
}

async function fetchMovies() {
  let allMovies = [];
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
    console.error("Error fetching movies:", error);
    return [];
  }
}

async function fetchPersons() {
  let allPersons = [];
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
    console.error("Error fetching persons:", error);
    return [];
  }
}

async function fetchPopularPersons() {
  let allPersons = [];
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
    console.error("Error fetching popular persons:", error);
    return [];
  }
}

async function generateTVShowPaths() {
  try {
    const tvShows = await fetchTVShows();
    const paths = [];

    // Main TV show pages
    tvShows.forEach((tvShow) => {
      const lastMod = safelyFormatDate(
        tvShow.last_air_date || tvShow.first_air_date
      );
      const baseUrl = `/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}`;

      paths.push(
        { loc: baseUrl, lastmod: lastMod, priority: 1.0, changefreq: "daily" },
        {
          loc: `${baseUrl}/watch`,
          lastmod: lastMod,
          priority: 1.0,
          changefreq: "daily",
        },
        {
          loc: `${baseUrl}/photos`,
          lastmod: lastMod,
          priority: 0.8,
          changefreq: "weekly",
        },
        {
          loc: `${baseUrl}/reviews`,
          lastmod: lastMod,
          priority: 0.6,
          changefreq: "daily",
        },
        {
          loc: `${baseUrl}/seasons`,
          lastmod: lastMod,
          priority: 0.6,
          changefreq: "weekly",
        },
        {
          loc: `${baseUrl}/cast`,
          lastmod: lastMod,
          priority: 0.7,
          changefreq: "monthly",
        }
      );
    });

    // Generate cast entries
    const castResults = await processBatch(tvShows, async (show) => {
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
    });

    const casts = castResults.flat();
    casts.forEach((cast) => {
      paths.push({
        loc: `/person/${cast.id}-${spaceToHyphen(cast.name)}`,
        lastmod: new Date().toISOString(),
        priority: 1.0,
        changefreq: "monthly",
      });
    });

    // Generate keyword entries
    const keywordResults = await processBatch(tvShows, async (show) => {
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
    });

    const keywords = keywordResults.flat();
    keywords.forEach((keyword) => {
      paths.push({
        loc: `/keyword/${keyword.id}/tv`,
        lastmod: new Date().toISOString(),
        priority: 0.5,
        changefreq: "monthly",
      });
    });

    return paths;
  } catch (error) {
    console.error("Error generating TV show paths:", error);
    return [];
  }
}

async function generateKoreanTVShowPaths() {
  try {
    const tvShows = await fetchKoreanTVShows();
    const paths = [];

    // Main Korean TV show pages
    tvShows.forEach((tvShow) => {
      const lastMod = safelyFormatDate(
        tvShow.last_air_date || tvShow.first_air_date
      );
      const baseUrl = `/tv/${tvShow.id}-${spaceToHyphen(tvShow.name)}`;

      paths.push(
        { loc: baseUrl, lastmod: lastMod, priority: 1.0, changefreq: "daily" },
        {
          loc: `${baseUrl}/watch`,
          lastmod: lastMod,
          priority: 1.0,
          changefreq: "daily",
        },
        {
          loc: `${baseUrl}/photos`,
          lastmod: lastMod,
          priority: 0.8,
          changefreq: "weekly",
        },
        {
          loc: `${baseUrl}/reviews`,
          lastmod: lastMod,
          priority: 0.6,
          changefreq: "daily",
        },
        {
          loc: `${baseUrl}/seasons`,
          lastmod: lastMod,
          priority: 0.6,
          changefreq: "weekly",
        },
        {
          loc: `${baseUrl}/cast`,
          lastmod: lastMod,
          priority: 0.7,
          changefreq: "monthly",
        }
      );
    });

    // Generate cast and keyword entries similar to regular TV shows
    const castResults = await processBatch(tvShows, async (show) => {
      try {
        const response = await fetchWithRetry(
          `https://api.themoviedb.org/3/tv/${show.id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const data = await response.json();
        return data.cast || [];
      } catch (error) {
        return [];
      }
    });

    const casts = castResults.flat();
    casts.forEach((cast) => {
      paths.push({
        loc: `/person/${cast.id}-${spaceToHyphen(cast.name)}`,
        lastmod: new Date().toISOString(),
        priority: 1.0,
        changefreq: "monthly",
      });
    });

    return paths;
  } catch (error) {
    console.error("Error generating Korean TV show paths:", error);
    return [];
  }
}

async function generateMoviePaths() {
  try {
    const movies = await fetchMovies();
    const paths = [];

    // Main movie pages
    movies.forEach((movie) => {
      const lastMod = safelyFormatDate(movie.release_date);
      const baseUrl = `/movie/${movie.id}-${spaceToHyphen(movie.title)}`;

      paths.push(
        { loc: baseUrl, lastmod: lastMod, priority: 1.0, changefreq: "daily" },
        {
          loc: `${baseUrl}/watch`,
          lastmod: lastMod,
          priority: 1.0,
          changefreq: "daily",
        },
        {
          loc: `${baseUrl}/cast`,
          lastmod: lastMod,
          priority: 0.6,
          changefreq: "monthly",
        },
        {
          loc: `${baseUrl}/photos`,
          lastmod: lastMod,
          priority: 0.8,
          changefreq: "weekly",
        }
      );
    });

    // Generate cast entries
    const castResults = await processBatch(movies, async (movie) => {
      try {
        const response = await fetchWithRetry(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const data = await response.json();
        return data.cast || [];
      } catch (error) {
        return [];
      }
    });

    const casts = castResults.flat();
    casts.forEach((cast) => {
      paths.push({
        loc: `/person/${cast.id}-${spaceToHyphen(cast.name)}`,
        lastmod: new Date().toISOString(),
        priority: 1.0,
        changefreq: "monthly",
      });
    });

    // Generate keyword entries
    const keywordResults = await processBatch(movies, async (movie) => {
      try {
        const response = await fetchWithRetry(
          `https://api.themoviedb.org/3/movie/${movie.id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const data = await response.json();
        return data.keywords || [];
      } catch (error) {
        return [];
      }
    });

    const keywords = keywordResults.flat();
    keywords.forEach((keyword) => {
      paths.push({
        loc: `/keyword/${keyword.id}/movie`,
        lastmod: new Date().toISOString(),
        priority: 0.5,
        changefreq: "monthly",
      });
    });

    return paths;
  } catch (error) {
    console.error("Error generating movie paths:", error);
    return [];
  }
}

async function generatePersonPaths() {
  try {
    const [persons, popularPersons] = await Promise.all([
      fetchPersons(),
      fetchPopularPersons(),
    ]);

    const allPersons = [...persons, ...popularPersons];
    const uniquePersons = allPersons.filter(
      (person, index, self) =>
        index === self.findIndex((p) => p.id === person.id)
    );

    return uniquePersons.map((person) => ({
      loc: `/person/${person.id}-${spaceToHyphen(person.name)}`,
      lastmod: new Date().toISOString(),
      priority: 1.0,
      changefreq: "weekly",
    }));
  } catch (error) {
    console.error("Error generating person paths:", error);
    return [];
  }
}

async function generateGenrePaths() {
  try {
    const [tvGenresResponse, movieGenresResponse] = await Promise.all([
      fetchWithRetry(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
      ),
      fetchWithRetry(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
      ),
    ]);

    const [tvGenresData, movieGenresData] = await Promise.all([
      tvGenresResponse.json(),
      movieGenresResponse.json(),
    ]);

    const paths = [];

    // TV genres
    if (tvGenresData.genres) {
      tvGenresData.genres.forEach((genre) => {
        paths.push({
          loc: `/genre/${genre.id}-${spaceToHyphen(genre.name)}/tv`,
          lastmod: new Date().toISOString(),
          priority: 0.5,
          changefreq: "monthly",
        });
      });
    }

    // Movie genres
    if (movieGenresData.genres) {
      movieGenresData.genres.forEach((genre) => {
        paths.push({
          loc: `/genre/${genre.id}-${spaceToHyphen(genre.name)}/movie`,
          lastmod: new Date().toISOString(),
          priority: 0.5,
          changefreq: "monthly",
        });
      });
    }

    return paths;
  } catch (error) {
    console.error("Error generating genre paths:", error);
    return [];
  }
}

async function generateNetworkPaths() {
  try {
    const response = await fetchWithRetry(
      `https://api.themoviedb.org/3/network/2007?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    );
    const network = await response.json();

    if (network) {
      return [
        {
          loc: `/network/${network.id}`,
          lastmod: new Date().toISOString(),
          priority: 0.5,
          changefreq: "monthly",
        },
      ];
    }
    return [];
  } catch (error) {
    console.error("Error generating network paths:", error);
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_APP_URL || "https://mijudramainfo.mijublog.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,

  // Static pages configuration
  additionalSitemaps: [
    // Add any additional sitemaps if needed
  ],

  // Custom transform function for static pages
  transform: async (config, path) => {
    // Custom priority and changefreq for specific static pages
    const staticPageConfig = {
      "/": { priority: 1.0, changefreq: "daily" },
      "/watch/tv": { priority: 1.0, changefreq: "daily" },
      "/watch/movie": { priority: 1.0, changefreq: "daily" },
      "/watch/anime": { priority: 1.0, changefreq: "daily" },
      "/drama/newest": { priority: 0.9, changefreq: "daily" },
      "/drama/top": { priority: 0.9, changefreq: "daily" },
      "/drama/upcoming": { priority: 0.9, changefreq: "daily" },
      "/drama/top_chinese_dramas": { priority: 0.9, changefreq: "daily" },
      "/drama/top_korean_dramas": { priority: 0.9, changefreq: "daily" },
      "/drama/top_japanese_dramas": { priority: 0.9, changefreq: "daily" },
      "/movie/newest": { priority: 0.9, changefreq: "daily" },
      "/movie/top": { priority: 0.9, changefreq: "daily" },
      "/movie/upcoming": { priority: 0.9, changefreq: "daily" },
      "/shows/variety": { priority: 0.9, changefreq: "daily" },
      "/people/top": { priority: 0.9, changefreq: "daily" },
      "/coin": { priority: 0.7, changefreq: "weekly" },
      "/signin": { priority: 0.6, changefreq: "monthly" },
      "/signup": { priority: 0.6, changefreq: "monthly" },
      "/faq": { priority: 0.5, changefreq: "monthly" },
      "/about": { priority: 0.5, changefreq: "monthly" },
      "/contact": { priority: 0.5, changefreq: "monthly" },
      "/terms": { priority: 0.5, changefreq: "monthly" },
    };

    const pageConfig = staticPageConfig[path] || {};

    return {
      loc: path,
      changefreq: pageConfig.changefreq || config.changefreq,
      priority: pageConfig.priority || config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Generate dynamic paths
  additionalPaths: async (config) => {
    let paths = [];

    try {
      console.log("🚀 Starting sitemap generation...");

      // Process all dynamic content in parallel with proper error handling
      const results = await Promise.allSettled([
        generateTVShowPaths(),
        generateKoreanTVShowPaths(),
        generateMoviePaths(),
        generatePersonPaths(),
        generateGenrePaths(),
        generateNetworkPaths(),
      ]);

      // Collect all successful results
      results.forEach((result, index) => {
        const taskNames = [
          "TV Shows",
          "Korean TV Shows",
          "Movies",
          "Persons",
          "Genres",
          "Networks",
        ];

        if (result.status === "fulfilled") {
          paths.push(...result.value);
          console.log(
            `✅ ${taskNames[index]}: ${result.value.length} paths generated`
          );
        } else {
          console.error(`❌ Error in ${taskNames[index]}:`, result.reason);
        }
      });

      console.log(`🎉 Total paths generated: ${paths.length}`);
    } catch (error) {
      console.error("❌ Error generating additionalPaths:", error);
    }

    return paths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/privacy",
          "/setting",
          "/friends",
          "/friends/request",
          "/notifications",
          "/lists",
          "/tv/*/edit", // This is the corrected line
          "/movie/*/edit", // This is the corrected line
          "/person/*/edit", // This is the corrected line
        ],
      },
    ],
  },
};
