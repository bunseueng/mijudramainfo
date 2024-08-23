
import moment from "moment";
import { NextResponse } from "next/server";

const currentYear = new Date().getFullYear();
const startDate = moment(`${currentYear}-01-01`).format("YYYY-MM-DD");
const endDate = moment(`${currentYear}-12-31`).format("YYYY-MM-DD");
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
// Get the current date
const currentDate = moment();
// Subtract 7 days from the current date
const sevenDaysAgo = currentDate.subtract(7, "days");
// Format the date if needed
const formattedDate = sevenDaysAgo.format("YYYY-MM-DD");

const headers = {
  accept: 'application/json',
  Authorization: 'Bearer ' + apiKey,
};

export const fetchTrending = async () => {
    const url  = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&first_air_date.gte=${startDate}&first_air_date.lte${endDate}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN&with_original_language=zh&without_genres=16,10764,35`
 
    const options = {
      method: 'GET',
      headers,
    };

    const res = await fetch(url, options);
  
    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
  
    const json = await res.json();
    return json;
};

export const fetchLatest = async () => {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&first_air_date_year=2024&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=first_air_date.desc&with_origin_country=CN&with_original_language=zh&without_genres=16,10764,10767,35`
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);
  
    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
  
    const json = await res.json();
    return json;
};

// fetch card when searching
export const fetchEpisodeCount = async (result_id: any) => {
  try {
    
    const url = `https://api.themoviedb.org/3/tv/${result_id}?api_key=${apiKey}&language=en-US`;
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);
  
    if (!res.ok) {
      if (res.status === 404) {
        console.log('TV show not found');
        return null; // or handle appropriately
      }
      throw new Error('Failed to fetch TV show');
    }
  
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('An error occurred while fetching the TV show data:', error);
    return null; // Return null or handle appropriately
  }
}

// fetch trailer
export const fetchTrendingVideos = async () => {
  const startDate = '2022-01-01'; // Start date for trending TV shows
  const endDate = '2022-12-31';   // End date for trending TV shows

  // Fetching trending TV shows
  const tvShowsResponse = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN&with_original_language=zh&without_genres=16&include_video=true`
  );
  const tvShowsData = await tvShowsResponse.json();
  
  // Extracting TV show IDs from the response
  const tvShowIds = tvShowsData.results.map((tvShow: any) => tvShow.id);
  
  // Array to store TV shows with videos
  const tvShowsWithVideos = [];

  // Fetching videos for each TV show
  for (const tvId of tvShowIds) {
      // Fetching videos for the current TV show
      const videosResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const videosData = await videosResponse.json();
      
      // Adding TV show with its videos to the array
      tvShowsWithVideos.push({
          tvShow: tvShowsData.results.find((tvShow: any) => tvShow.id === tvId),
          videos: videosData.results
      });
  }


  return tvShowsWithVideos;
};

export const fetchActor = async () => {
  try {
    const tvShowsResponse = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN&with_original_language=zh&without_genres=16&include_video=true&without_genre_ids=16,10764,10767`
    );
    const tvShowsData = await tvShowsResponse.json();

    const tvShowIds = tvShowsData.results.map((tvShow: any) => tvShow.id);

    const tvShowCast = [];
    const actorPaths = new Set(); // Set to store unique paths

    for (const tvId of tvShowIds) {
      const castResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );

      if (!castResponse.ok) {
        throw new Error(`Failed to fetch cast for TV show with ID ${tvId}`);
      }

      const castData = await castResponse.json();

      // Accessing items inside an array of objects (tvShowsData.results)
      const tvShow = tvShowsData.results.find((tvShow: any) => tvShow.id === tvId);

      // Accessing items inside an array of objects (castData.cast)
      const cast = castData.cast.filter((actor: any) => {
        if (!actorPaths.has(actor.profile_path)) {
          actorPaths.add(actor.profile_path);
          return true; // Add the actor if the path is unique
        }
        return false; // Skip the actor if the path is already encountered
      });

      tvShowCast.push({
        tvShow: tvShow,
        cast: cast
      });
    }
    return tvShowCast;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Or handle the error as appropriate for your application
  }
};

// fetch tv
export const fetchTv = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
  const countryUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
  
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  try {
    const [res, resOfCountry] = await Promise.all([fetch(url, options), fetch(countryUrl, options)]);

    if (!res.ok || !resOfCountry.ok) {
      console.log('Failed to fetch data');
      return null;
    }

    const tvShowData = await res.json();
    const countryData = await resOfCountry.json();

    // Find the matching country
    const originCountries = tvShowData.origin_country || [];
    const countryNames = originCountries.map((countryCode: string) => {
      const country = countryData.find((c: any) => c.iso_3166_1 === countryCode);
      return country ? country.english_name : countryCode;
    });

    // Add the 'type' field and origin country names
    const extraData = {
      ...tvShowData,
      type: countryNames,
    };

    return extraData;
  } catch (error) {
    console.error('An error occurred while fetching the data:', error);
    return null;
  }
};

// fetch tv trailer
export const fetchTrailer = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch movie trailer
export const fetchMovieTrailer = async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}
// fetch cast credit
export const fetchCastCredit = async (tv_id: any) => {
    const url = `https://api.themoviedb.org/3/tv/${tv_id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);
  
    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
  
    const json = await res.json();
    return json;
}

// fetch cast content
export const fetchContentRating = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/content_ratings?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch all cast credit details
export const fetchAllCast = async (tv_id: any) => {
  const url =  `https://api.themoviedb.org/3/tv/${tv_id}/aggregate_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch languages
export const fetchLanguages = async () => {
    const url = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);
  
    if (!res.ok) {
      throw new Error('Failed to fetch language');
    }
  
    const json = await res.json();
    return json;
}

//fetch keyword
export const fetchAllKeywords = async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/keyword?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch keywords');
  }

  const json = await res.json();
  return json;
}

// Fetch tv keyword
export const fetchKeyword = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch tv keyword');
  }

  const json = await res.json();
  return json;
}

// Fetch Genre
export const fetchGenre = async () => {
  const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// Fetch title
export const fetchTitle = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/alternative_titles?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch all page from popular tv show 
export async function fetchAllPopularTvShows() {
  let allTvShows = [] as any[];
  let page = 1;
  let totalPages = 1000; // Set an initial value

  try {
    // Continue fetching pages until all pages have been retrieved or until reaching the maximum allowable page
    while (page <= totalPages && page <= 500) {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`
      const options = {
        method: 'GET',
        headers,
      };
      
      const res = await fetch(url, options);
    
      if (!res.ok) {
        throw new Error('Failed to fetch movies');
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
}

// fetch review 
export const fetchReview = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/reviews?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch images
export const fetchImages = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/images?api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch videos
export const fetchVideos = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch recommendations
export const fetchRecommendation = async (tv_id: any) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}/recommendations?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`
    );
    const recommend = await res.json();

  return recommend;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
}

export const fetchSeasonEpisode = async (tv_id: any, season_number: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

export const fetchEpCast = async (tv_id: any, season_number: any, episodes: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}/episode/${episodes}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

export const fetchPerson = async (tv_id: any) => {
  try {
    
  const url = `https://api.themoviedb.org/3/person/${tv_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
  } catch (error) {
    console.log("Failed to fetch", error)
    return null
  }
}

export const fetchPersonCombinedCredits = async (tv_id: any) => {
  try {
    const url = `https://api.themoviedb.org/3/person/${tv_id}/combined_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.log("Failed to fetch", error)
    return null
  }
}

export const fetchPersonTv = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/person/${tv_id}/tv_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

export const fetchPersonMovie = async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/person/${tv_id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

export const fetchPersonExternalID = async (tv_id: any) => {
  try {
    const url = `https://api.themoviedb.org/3/person/${tv_id}/external_ids?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.log("Failed to fetch", error)
    return null
  }
}

export const fetchYtThumbnail = async (key: any, api: any) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${key}&key=${api}`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch multifor searching 
export const fetchMultiSearch = async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`;
  const countryUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;

  const options = {
    method: 'GET',
    headers,
  };

  try {
    // Fetch search results
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }

    const json = await res.json();

    // Fetch country data
    const countryRes = await fetch(countryUrl, options);

    if (!countryRes.ok) {
      throw new Error('Failed to fetch countries');
    }

    const countryData = await countryRes.json();

    // Function to determine country type for an item
    const determineCountryType = (item: any, countryData: any) => {
      const originCountries = item.origin_country || [];
      const countryNames = originCountries.map((countryCode: string) => {
        const country = countryData.find((c: any) => c.iso_3166_1 === countryCode);
        return country ? country.english_name : countryCode;
      });
      return countryNames.join(' ');
    };

    // Add countryType field to each item in results
    const resultsWithCountryType = json.results.map((item: any) => ({
      ...item,
      country: determineCountryType(item, countryData),
    }));

    return resultsWithCountryType;
  } catch (error) {
    console.error('An error occurred while fetching multi search data:', error);
    return null;
  }
};

// fetch tv for searching 
export const fetchTvSearch = async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch Movie for searching 
export const fetchMovieSearch = async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch fetchCollection for searching 
export const fetchCollectionSearch = async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/collection?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch fetchPerson for searching 
export const fetchPersonSearch = async (searchQuery: any) => {
  const url = `https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&with_original_language=zh&region=CN&season`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

export const fetchTopPeople = async (pages = 1) => {
  try {
    const url = `https://api.themoviedb.org/3/person/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${pages}`;
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Failed to fetch people');
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(error)
    throw new Error(error)
  }
}

// fetch top_rated drama
export const fetchTopDrama = async (pages  = 1) => {
  try {
    const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
    const countryParam = countries.join('|'); // Join countries with a pipe character
    
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=vote_count.desc&with_origin_country=${countryParam}&without_genres=16`;
    
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error(error)
    throw new Error(error)
  }
}

// fetch 100 top_rated drama
export const fetch100TopDrama = async (pages  = 1, countryParam = "") => {
  
    for (pages ; pages <= 5; pages++) {
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=vote_count.desc&with_origin_country=${countryParam}&without_genres=16`;
  
  const options = {
    method: 'GET',
    headers,
  };
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}
}

// fetch variety shows
export const fetchVariety = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&with_genres=10764,10767&without_genres=16,99,18`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch popular drama
export const fetchPopular = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch newest drama
export const fetchNewest = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&air_date.gte=${formattedDate}&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch upcoming drama
export const fetchUpcoming = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&with_status=2&without_genres=16,10764,10767,99`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

/// Fetch Movie

// fetch top_rated movie
export const fetchTopMovie = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=vote_count.desc&with_origin_country=${countryParam}&without_genres=16`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch popular movie
export const fetchPopularMovie = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&sort_by=popularity.desc&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch newest movie
export const fetchNewestMovie = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pages}&air_date.gte=${formattedDate}&with_origin_country=${countryParam}&without_genres=16,10764,10767,99`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch upcoming movie
export const fetchUpcomingMovie = async (pages  = 1) => {
  const countries = ['CN', 'KR', 'JP']; // Example: add your desired countries here
  const countryParam = countries.join('|'); // Join countries with a pipe character
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&language=en-US&page=${pages}&sort_by=primary_release_date.desc&with_origin_country=${countryParam}&region=${countryParam}&without_genres=16,10764,10767,99`;
  
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch movie
export const fetchMovie = async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    console.log('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch movie cast credit
export const fetchMovieCastCredit = async (movie_id: any) => {
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);
  
    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
  
    const json = await res.json();
    return json;
}

// fetch languages
export const fetchMovieLanguages = async () => {
    const url = `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
    const options = {
      method: 'GET',
      headers,
    };
    
    const res = await fetch(url, options);
  
    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
  
    const json = await res.json();
    return json;
}

// Fetch movie keyword
export const fetchMovieKeyword = async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// Fetch movie title
export const fetchMovieTitle = async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/alternative_titles?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}


// fetch movie review 
export const fetchMovieReview = async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/reviews?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch movie images
export const fetchMovieImages = async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch movie videos
export const fetchMovieVideos = async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
  const options = {
    method: 'GET',
    headers,
  };
  
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const json = await res.json();
  return json;
}

// fetch movie recommendations
export const fetchMovieRecommendation = async (movie_id: any) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`
    );
    const recommend = await res.json();

  return recommend;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
}

export const fetchTvWatchProvider = async (tv_id: string) => {
  try {
    // Step 1: Fetch watch provider data from TMDb
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const provider = await res.json();
    return provider
  } catch (error) {
    return { message: "Failed to fetch data", status: 501 };
  }
};

// Function to get user country code (Geolocation or IP-based)
const getUserCountryCode = async () => {
  try {
    // Using a third-party API to get the country code
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data.country_code; // e.g., "US", "CA", etc.
  } catch (error) {
    console.error("Failed to fetch country code: ", error);
    return "US"; // Default to "US" as a fallback
  }
};
