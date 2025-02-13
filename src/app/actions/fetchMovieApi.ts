import moment from "moment";
import { NextResponse } from "next/server";
import { cache } from "react";

const currentYear = new Date().getFullYear();
const startDate = moment(`${currentYear}-01-01`).format("YYYY-MM-DD");
const endDate = moment(`${currentYear}-12-31`).format("YYYY-MM-DD");
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const TMDB_URL = "https://api.themoviedb.org/3";
// Get the current date
const currentDate = moment();
// Subtract 7 days from the current date
const sevenDaysAgo = currentDate.subtract(7, "days");
// Format the date if needed
const formattedDate = sevenDaysAgo.format("YYYY-MM-DD");

const headers = {
  accept: "application/json",
  Authorization: "Bearer " + apiKey,
  "Cache-Control": "s-maxage=3600, stale-while-revalidate",
};

export const fetchTrending = cache(async () => {
  try {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&first_air_date.gte=${startDate}&first_air_date.lte${endDate}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN&with_original_language=zh&without_genres=16,10764,35`;

    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("An error occurred while fetching the Trending data:", error);
    return null; // Return null or handle appropriately
  }
});

export const fetchActor = cache(async () => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    const endDate = new Date();

    // First, get the most popular TV shows
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}` +
        `&first_air_date.gte=${startDate.toISOString().split("T")[0]}` +
        `&first_air_date.lte=${endDate.toISOString().split("T")[0]}` +
        "&include_adult=false" +
        "&include_null_first_air_dates=false" +
        "&language=en-US" +
        "&page=1" +
        "&sort_by=popularity.desc" +
        "&with_origin_country=CN" +
        "&with_original_language=zh" +
        "&without_genres=16,10764,10767"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV shows data");
    }

    const data = await response.json();

    // Get the top 5 shows to fetch cast from
    const topShows = data.results.slice(0, 5);

    // Fetch cast data for all shows in a single request using Promise.all
    const castPromises = topShows.map((show: any) =>
      fetch(
        `https://api.themoviedb.org/3/tv/${show.id}/aggregate_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      ).then((res) => res.json())
    );

    const castResults = await Promise.all(castPromises);

    // Process the cast data to remove duplicates
    const uniqueActors = new Map();
    castResults.forEach((credits) => {
      if (credits?.cast) {
        credits.cast.forEach((actor: any) => {
          if (actor.profile_path && !uniqueActors.has(actor.id)) {
            uniqueActors.set(actor.id, {
              id: actor.id,
              name: actor.name,
              profile_path: actor.profile_path,
              character: actor.roles?.[0]?.character || "",
              order: actor.order,
              popularity: actor.popularity,
            });
          }
        });
      }
    });

    // Convert the Map to an array and sort by popularity
    const actors = Array.from(uniqueActors.values())
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20); // Limit to top 20 actors

    return actors;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
});

// fetch batched tv
export const fetchTv = cache(async (ids: string | string[]) => {
  try {
    const url = `/api/tmdb_drama/drama`;
    const countryUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
      body: JSON.stringify({ ids: Array.isArray(ids) ? ids : [ids] }),
      next: {
        revalidate: 3600,
        tags: ["tv-details"],
      },
    };

    const [response, countryResponse] = await Promise.all([
      fetch(url, options),
      fetch(countryUrl, {
        next: {
          revalidate: 86400,
        },
      }),
    ]);

    if (!response.ok || !countryResponse.ok) {
      throw new Error("Failed to fetch TV details or countries");
    }

    const [tvData, countryData] = await Promise.all([
      response.json(),
      countryResponse.json(),
    ]);

    const processShow = (show: any) => {
      const originCountries = show.origin_country || [];
      const countryNames = originCountries.map((countryCode: string) => {
        const country = countryData.find(
          (c: any) => c.iso_3166_1 === countryCode
        );
        return country ? country.english_name : countryCode;
      });

      return {
        ...show,
        type: countryNames,
      };
    };

    return Array.isArray(ids)
      ? tvData.map(processShow)
      : processShow(tvData[0]);
  } catch (error) {
    console.error("Error fetching TV details:", error);
    throw error;
  }
});

// fetch movie
export const fetchMovie = cache(async (ids: string | string[]) => {
  try {
    const url = `/api/tmdb_movie/movie`;
    const countryUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
      body: JSON.stringify({ ids: Array.isArray(ids) ? ids : [ids] }),
      next: {
        revalidate: 3600,
        tags: ["movie-details"],
      },
    };

    const [response, countryResponse] = await Promise.all([
      fetch(url, options),
      fetch(countryUrl, {
        next: {
          revalidate: 86400,
        },
      }),
    ]);

    if (!response.ok || !countryResponse.ok) {
      throw new Error("Failed to fetch TV details or countries");
    }

    const [movieData, countryData] = await Promise.all([
      response.json(),
      countryResponse.json(),
    ]);

    const processShow = (show: any) => {
      const originCountries = show.origin_country || [];
      const countryNames = originCountries.map((countryCode: string) => {
        const country = countryData.find(
          (c: any) => c.iso_3166_1 === countryCode
        );
        return country ? country.english_name : countryCode;
      });

      return {
        ...show,
        type: countryNames,
      };
    };

    return Array.isArray(ids)
      ? movieData.map(processShow)
      : processShow(movieData[0]);
  } catch (error) {
    console.error("Error fetching TV details:", error);
    throw error;
  }
});

// fetch movie trailer
export const fetchMovieTrailer = cache(async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch all cast credit details
export const fetchAllCast = cache(async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/aggregate_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch languages
export const fetchLanguages = cache(async () => {
  const url = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch language");
  }

  const json = await res.json();
  return json;
});

//fetch keyword
export const fetchAllKeywords = cache(async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/keyword?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch keywords");
  }

  const json = await res.json();
  return json;
});

// fetch all page from popular tv show
export const fetchAllPopularTvShows = cache(async () => {
  let allTvShows = [] as any[];
  let page = 1;
  let totalPages = 1000; // Set an initial value

  try {
    // Continue fetching pages until all pages have been retrieved or until reaching the maximum allowable page
    while (page <= totalPages && page <= 500) {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`;
      const options = {
        method: "GET",
        headers,
      };

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error("Failed to fetch movies");
      }

      const json = await res.json();

      // Update totalPages if it's not set yet
      if (totalPages === 1) {
        totalPages = json.total_pages;
      }

      // Check if data.results is an array
      if (Array.isArray(json.results)) {
        // Append results from current page to the allTvShows array
        allTvShows = [...allTvShows, ...json.results];
      } else {
        console.error("Invalid data format:", json);
        // Stop fetching if data.results is not an array
        break;
      }

      // Move to the next page
      page++;
      return json;
    }
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
  }

  return allTvShows;
});

export const fetchSeasonEpisode = cache(
  async (tv_id: any, season_number: any) => {
    try {
      const url = `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
      const options = {
        method: "GET",
        headers,
      };

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error("Failed to fetch movies");
      }

      const json = await res.json();
      return json;
    } catch (error) {
      console.error("Error fetching season episode:", error);
      return { poster_path: null, episodes: [] }; // Return a default value or empty data
    }
  }
);

export const fetchEpCast = cache(
  async (tv_id: any, season_number: any, episodes: any) => {
    const url = `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}/episode/${episodes}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }

    const json = await res.json();
    return json;
  }
);

export const fetchPerson = cache(async (ids: string | string[]) => {
  try {
    const url = `/api/tmdb_person/person`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
      body: JSON.stringify({ ids }),
      next: {
        revalidate: 3600,
        tags: ["movie-details"],
      },
    };
    const res = await fetch(url, options);

    if (!res.ok) {
      console.log("Failed to fetch movies");
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
});

export const fetchPersonExternalID = cache(async (tv_id: any) => {
  try {
    const url = `https://api.themoviedb.org/3/person/${tv_id}/external_ids?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
});

// fetch multifor searching
export const fetchMultiSearch = cache(async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`;
  const countryUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;

  const options = {
    method: "GET",
    headers,
  };

  try {
    // Fetch search results

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }

    const json = await res.json();

    // Fetch country data
    const countryRes = await fetch(countryUrl, options);

    if (!countryRes.ok) {
      throw new Error("Failed to fetch countries");
    }

    const countryData = await countryRes.json();

    // Function to determine country type for an item
    const determineCountryType = (item: any, countryData: any) => {
      const originCountries = item.origin_country || [];
      const countryNames = originCountries.map((countryCode: string) => {
        const country = countryData.find(
          (c: any) => c.iso_3166_1 === countryCode
        );
        return country ? country.english_name : countryCode;
      });
      return countryNames.join(" ");
    };

    // Add countryType field to each item in results
    const resultsWithCountryType = json.results.map((item: any) => ({
      ...item,
      country: determineCountryType(item, countryData),
    }));

    return resultsWithCountryType;
  } catch (error) {
    console.error("An error occurred while fetching multi search data:", error);
    return null;
  }
});

// fetch tv for searching
export const fetchTvSearch = cache(async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch Movie for searching
export const fetchMovieSearch = cache(async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch fetchCollection for searching
export const fetchCollectionSearch = cache(async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/collection?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch fetchPerson for searching
export const fetchPersonSearch = cache(async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

export const fetchCompany = cache(async (searchQuery: string, page = 1) => {
  try {
    const url = `https://api.themoviedb.org/3/search/company?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&page=${page}&language=en-US`;
    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch people");
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

export const fetchTvNetworks = cache(async (network_id: string) => {
  try {
    const url = `https://api.themoviedb.org/3/network/${network_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch people");
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

export const fetchTopPeople = cache(async (pages = 1) => {
  try {
    const url = `https://api.themoviedb.org/3/person/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${pages}`;
    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch people");
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

// fetch top_rated drama
export const fetchTopDrama = cache(async (pages = 1) => {
  try {
    const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
    const countryParam = countries.join("|"); // Join countries with a pipe character

    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=vote_count.desc&with_origin_country=${countryParam}&without_genres=16`;

    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

// fetch 100 top_rated drama
export const fetch100TopDrama = cache(async (pages = 1, countryParam = "") => {
  for (pages; pages <= 5; pages++) {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=vote_count.desc&with_origin_country=${countryParam}&without_genres=16`;

    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }

    const json = await res.json();
    return json;
  }
});

// fetch variety shows
export const fetchVariety = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&with_genres=10764,10767&without_genres=16,99,18`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch popular drama
export const fetchPopular = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch newest drama
export const fetchNewest = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&air_date.gte=${formattedDate}&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch upcoming drama
export const fetchUpcoming = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&with_status=2&without_genres=16,10764,10767,99`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch top_rated movie
export const fetchTopMovie = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=vote_count.desc&with_origin_country=${countryParam}&without_genres=16`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch popular movie
export const fetchPopularMovie = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch newest movie
export const fetchNewestMovie = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&air_date.gte=${formattedDate}&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch upcoming movie
export const fetchTvByNetwork = cache(
  async (
    pages = 1,
    network_id: string,
    sortby: string | undefined,
    genre: string | undefined,
    without_genre: string | undefined
  ) => {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&language=en-US&page=${pages}&sort_by=primary_release_date.desc&with_networks=${network_id}&with_genres=${genre}&without_genres=${without_genre}&sort_by=${sortby}`;

    const options = {
      method: "GET",
      headers,
      next: { revalidate: 3600 },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }

    const json = await res.json();
    return json;
  }
);

export const fetchUpcomingMovie = cache(async (pages = 1) => {
  const countries = ["CN", "KR", "JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&language=en-US&page=${pages}&sort_by=primary_release_date.desc&with_origin_country=${countryParam}&region=${countryParam}&without_genres=16,10764,10767,99`;

  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

// fetch movie images
export const fetchMovieImages = cache(async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const json = await res.json();
  return json;
});

export const fetchPopularSearch = cache(async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN`
    );
    const result = await res.json();
    return result.results;
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 501 }
    );
  }
});

export const fetchHomepageDrama = cache(async () => {
  try {
    const url = `/api/tmdb_drama/home`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate }),
    });
    if (!response.ok) throw new Error("Failed to fetch ratings");
    return response.json();
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return {};
  }
});

export const fetchTvKeywords = cache(
  async (
    page: number,
    keyword_id: string,
    sortBy: string | undefined,
    genre: string,
    withoutGenre: string,
    country: string
  ) => {
    const url = new URL("https://api.themoviedb.org/3/discover/tv");
    url.searchParams.append(
      "api_key",
      process.env.NEXT_PUBLIC_API_KEY as string
    );
    url.searchParams.append("language", "en-US");
    url.searchParams.append("page", page.toString());
    url.searchParams.append("with_keywords", keyword_id);
    if (sortBy) url.searchParams.append("sort_by", sortBy);
    url.searchParams.append("with_genres", genre);
    url.searchParams.append("without_genres", withoutGenre);
    url.searchParams.append("with_origin_country", country);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch TV shows");
    return response.json();
  }
);

export const fetchMovieKeywords = cache(
  async (
    page: number,
    keyword_id: string,
    sortBy: string | undefined,
    withoutGenre: string | undefined,
    country: string | undefined
  ) => {
    try {
      const url = new URL("https://api.themoviedb.org/3/discover/movie");
      url.searchParams.append(
        "api_key",
        process.env.NEXT_PUBLIC_API_KEY as string
      );
      url.searchParams.append("language", "en-US");
      url.searchParams.append("page", page.toString());
      url.searchParams.append("with_keywords", keyword_id);

      // Append optional parameters only if they are defined
      if (sortBy) url.searchParams.append("sort_by", sortBy);
      if (withoutGenre) url.searchParams.append("without_genres", withoutGenre);
      if (country) url.searchParams.append("with_origin_country", country);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch Movie shows: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching movie keywords:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }
);

export const fetchTvGenre = cache(
  async (
    page: number,
    genre: string,
    sortBy: string | undefined,
    withoutGenre: string,
    country: string
  ) => {
    const url = new URL("https://api.themoviedb.org/3/discover/tv");
    url.searchParams.append(
      "api_key",
      process.env.NEXT_PUBLIC_API_KEY as string
    );
    url.searchParams.append("language", "en-US");
    url.searchParams.append("with_genres", genre);
    url.searchParams.append("page", page.toString());
    if (sortBy) url.searchParams.append("sort_by", sortBy);
    url.searchParams.append("without_genres", withoutGenre);
    url.searchParams.append("with_origin_country", country);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch TV shows");
    return response.json();
  }
);

export const fetchMovieGenre = cache(
  async (
    page: number,
    genre: string,
    sortBy: string | undefined,
    country: string
  ) => {
    const url = new URL("https://api.themoviedb.org/3/discover/movie");
    url.searchParams.append(
      "api_key",
      process.env.NEXT_PUBLIC_API_KEY as string
    );
    url.searchParams.append("language", "en-US");
    url.searchParams.append("with_genres", genre);
    url.searchParams.append("page", page.toString());
    if (sortBy) url.searchParams.append("sort_by", sortBy);
    url.searchParams.append("with_origin_country", country);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch TV shows");
    return response.json();
  }
);

export const fetchRatings = cache(async (ids: string[]) => {
  try {
    const url = `/api/rating/${ids}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error("Failed to fetch ratings");
    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch ratings");
    return {};
  }
});

export const fetchPersonLike = cache(async (ids: string[]) => {
  try {
    const url = `/api/person/${ids}/love`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error("Failed to fetch person");
    return response.json();
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return {};
  }
});

export const fetchTrailer = cache(async (ids: string[]) => {
  // Deduplicate IDs
  const uniqueIds = [...new Set(ids)];

  try {
    const url = `/api/trailer`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: uniqueIds }),
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch video details");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching video details:", error);
    return [];
  }
});

const fetchApi = cache( async (endpoint: string, params: Record<string, any> = {}) => {
  const searchParams = new URLSearchParams({
    api_key: apiKey!,
    ...params,
  });

  const response = await fetch(`${TMDB_URL}${endpoint}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
});

export interface FilterParams {
  page?: number;
  with_genres?: string;
  with_origin_country?: string;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  sort_by?: string;
}

export const getPopularByParams = cache(async (
  type: string,
  params: FilterParams
) => {
  return fetchApi(`/discover/${type}`, params);
});

export const getImageUrl = cache((
  path: string,
  backdrop: string,
  size = "original"
) => {
  return `https://image.tmdb.org/t/p/${size}${path || backdrop}`;
});

export const getGenres = cache(async (type: string) => {
  return fetchApi(`/genre/${type}/list`);
});

export const getCountries = cache(async () => {
  return fetchApi("/configuration/countries");
});
