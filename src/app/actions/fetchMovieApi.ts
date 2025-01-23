import moment from "moment";
import { NextResponse } from "next/server";
import { cache } from 'react'

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
  'Cache-Control': 's-maxage=3600, stale-while-revalidate',
};

export const fetchTrending = cache(async () => {
  try{ 
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
  } catch (error) {
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchLatest = cache(async () => {
  try {
    
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
  } catch (error) {
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

// fetch card when searching
export const fetchEpisodeCount = cache(async (result_id: any) => {
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
})


export const fetchActor = cache(async () => {
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
});

// fetch tv

export const fetchTv = cache(async (tv_id: any) => {
  const url = `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
  const countryUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
  
  try {
    const [res, resOfCountry] = await Promise.all([fetch(url), fetch(countryUrl)]);

    if (!res.ok || !resOfCountry.ok) {
      console.log('Failed to fetch data');
      return null;
    }

    const tvShowData = await res.json();
    const countryData = await resOfCountry.json();

    const originCountries = tvShowData.origin_country || [];
    const countryNames = originCountries.map((countryCode: string) => {
      const country = countryData.find((c: any) => c.iso_3166_1 === countryCode);
      return country ? country.english_name : countryCode;
    });

    return {
      ...tvShowData,
      type: countryNames,
    };
  } catch (error) {
    console.error('An error occurred while fetching the data:', error);
    return null;
  }
});

// fetch tv trailer
export const fetchTrailer = cache(async (tv_id: any) => {
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
})

// fetch movie trailer
export const fetchMovieTrailer = cache(async (movie_id: any) => {
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
})
// fetch cast credit
export const fetchCastCredit = cache(async (tv_id: any) => {
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
})

// fetch cast content
export const fetchContentRating = cache(async (tv_id: any) => {
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
})

// fetch all cast credit details
export const fetchAllCast = cache(async (tv_id: any) => {
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
})

// fetch languages
export const fetchLanguages = cache(async () => {
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
})

//fetch keyword
export const fetchAllKeywords = cache(async (searchQuery: any) => {
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
})

// Fetch tv keyword
export const fetchKeyword = cache(async (tv_id: any) => {
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
})

// Fetch title
export const fetchTitle = cache(async (tv_id: any) => {
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
})

// fetch all page from popular tv show 
export const fetchAllPopularTvShows = cache( async() => { 
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
})

// fetch review 
export const fetchReview = cache(async (tv_id: any) => {
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
})

// fetch images
export const fetchImages = cache(async (tv_id: any) => {
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
})

// fetch videos
export const fetchVideos = cache(async (tv_id: any) => {
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
})

// fetch recommendations
export const fetchRecommendation = cache(async (tv_id: any) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}/recommendations?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`
    );
    const recommend = await res.json();

  return recommend;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
})

export const fetchSeasonEpisode = cache(async (tv_id: any, season_number: any) => {
  try {
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
  } catch (error) {
    console.error('Error fetching season episode:', error);
    return { poster_path: null, episodes: [] }; // Return a default value or empty data
  }
})

export const fetchEpCast = cache(async (tv_id: any, season_number: any, episodes: any) => {
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
})

export const fetchPerson = cache(async (tv_id: any) => {
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
})

export const fetchPersonCombinedCredits = cache(async (tv_id: any) => {
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
})

export const fetchPersonTv = cache(async (tv_id: any) => {
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
})

export const fetchPersonMovie = cache(async (tv_id: any) => {
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
})

export const fetchPersonExternalID = cache(async (tv_id: any) => {
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
})

// fetch person images
export const fetchPersonImages = cache(async (person_id: any) => {
  try {
    const url = `https://api.themoviedb.org/3/person/${person_id}/images?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
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
})

// fetch multifor searching 
export const fetchMultiSearch = cache(async (searchQuery: any) => {
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
});

// fetch tv for searching 
export const fetchTvSearch = cache(async (searchQuery: any) => {
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
})

// fetch Movie for searching 
export const fetchMovieSearch = cache(async (searchQuery: any) => {
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
})

// fetch fetchCollection for searching 
export const fetchCollectionSearch = cache(async (searchQuery: any) => {
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
})

// fetch fetchPerson for searching 
export const fetchPersonSearch = cache(async (searchQuery: any) => {
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
})

export const fetchCompany = cache(async (searchQuery: string, page = 1) => {
  try {
    const url = `https://api.themoviedb.org/3/search/company?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&page=${page}&language=en-US`;
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
})

export const fetchTvNetworks = cache(async (network_id:string) => {
  try {
    const url = `https://api.themoviedb.org/3/network/${network_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
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
})

export const fetchTopPeople = cache(async (pages = 1) => {
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
})

// fetch top_rated drama
export const fetchTopDrama = cache(async (pages  = 1) => {
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
})

// fetch 100 top_rated drama
export const fetch100TopDrama = cache(async (pages  = 1, countryParam = "") => {
  
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
})

// fetch variety shows
export const fetchVariety = cache(async (pages  = 1) => {
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
})

// fetch popular drama
export const fetchPopular = cache(async (pages  = 1) => {
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
})

// fetch newest drama
export const fetchNewest = cache(async (pages  = 1) => {
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
})

// fetch upcoming drama
export const fetchUpcoming = cache(async (pages  = 1) => {
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
})

// fetch top_rated movie
export const fetchTopMovie = cache(async (pages  = 1) => {
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
})

// fetch popular movie
export const fetchPopularMovie = cache(async (pages  = 1) => {
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
})

// fetch newest movie
export const fetchNewestMovie = cache(async (pages  = 1) => {
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
})

// fetch upcoming movie
export const fetchTvByNetwork = cache(async (pages  = 1, network_id: string, sortby: string | undefined, genre: string | undefined, without_genre: string | undefined) => {
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&language=en-US&page=${pages}&sort_by=primary_release_date.desc&with_networks=${network_id}&with_genres=${genre}&without_genres=${without_genre}&sort_by=${sortby}`;
  
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
})

export const fetchUpcomingMovie = cache(async (pages  = 1) => {
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
})

// fetch movie
export const fetchMovie = cache(async (movie_id: any) => {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=releases&language=en-US`
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
})

// fetch movie cast credit
export const fetchMovieCastCredit = cache(async (movie_id: any) => {
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
})

// Fetch movie keyword
export const fetchMovieKeyword = cache(async (movie_id: any) => {
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
})

// Fetch movie title
export const fetchMovieTitle = cache(async (movie_id: any) => {
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
})


// fetch movie review 
export const fetchMovieReview = cache(async (movie_id: any) => {
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
})

// fetch movie images
export const fetchMovieImages = cache(async (movie_id: any) => {
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
})

// fetch movie videos
export const fetchMovieVideos = cache(async (movie_id: any) => {
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
})

// fetch movie recommendations
export const fetchMovieRecommendation = cache(async (movie_id: any) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`
    );
    const recommend = await res.json();

  return recommend;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
})

export const fetchTvWatchProvider = cache(async (tv_id: any) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const provider = await res.json();

    return provider?.results;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
})

export const fetchMovieWatchProvider = cache(async (movie_id: any) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const provider = await res.json();

    return provider?.results;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
})

export const fetchTvKeyword = cache(async (pages  = 1, keyword_id: string, sortby: string | undefined, genre: string | undefined, without_genre: string | undefined, country: string) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&page=${pages}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_keywords=${keyword_id}&with_genres=${genre}&without_genres=${without_genre}&sort_by=${sortby}&with_origin_country=${country}`
    );
    const keyword = await res.json();

    return keyword;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
})

export const fetchMovieKeywords = cache(async (pages  = 1, keyword_id: string, sortby: string | undefined, without_genre: string | undefined, country: string) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&page=${pages}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_keywords=${keyword_id}&without_genres=${without_genre}&sort_by=${sortby}&with_origin_country=${country}`
    );
    const keyword = await res.json();

    return keyword;
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
})

export const fetchPopularSearch = cache(async () => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN`)
    const result = await res.json();
    return result.results
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch data"}, {status: 501})
  }
})

export const fetchIqiyiDrama = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=1330&without_genres=16%2C10764%2C10767%2C35`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchYoukuDrama = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=1419&without_genres=16%2C10764%2C10767%2C35`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchTencentDrama = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=2007&without_genres=16%2C10764%2C10767%2C35`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchMongoTVDrama = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=1631&without_genres=16%2C10764%2C10767%2C35`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchKoreanDrama = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&with_origin_country=KR&without_genres=16%2C10764%2C10767%2C35`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchJapaneseDrama = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&with_origin_country=JP&without_genres=16%2C10764%2C10767%2C35`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchAnime = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&&with_genres=16&with_origin_country=CN`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchJapaneseAnime = cache(async() => {
  try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&&with_genres=16&with_origin_country=JP`
    
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
    console.error('An error occurred while fetching the Trending data:', error);
    return null; // Return null or handle appropriately
  }
});

export const fetchBatchTv = cache(async (tvIds: number[]) => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  const tvDetailsUrl = `https://api.themoviedb.org/3/tv/`
  const countryUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${apiKey}&language=en-US`

  try {
    const [countryRes, ...tvResponses] = await Promise.all([
      fetch(countryUrl),
      ...tvIds.map((id) => fetch(`${tvDetailsUrl}${id}?api_key=${apiKey}&language=en-US`)),
    ])

    if (!countryRes.ok || tvResponses.some((res) => !res.ok)) {
      console.log("Failed to fetch data")
      return null
    }

    const countryData = await countryRes.json()
    const tvShowsData = await Promise.all(tvResponses.map((res) => res.json()))

    const processedTvShows = tvShowsData.map((tvShow: any) => {
      const originCountries = tvShow.origin_country || []
      const countryNames = originCountries.map((countryCode: string) => {
        const country = countryData.find((c: any) => c.iso_3166_1 === countryCode)
        return country ? country.english_name : countryCode
      })

      return {
        ...tvShow,
        type: countryNames,
      }
    })

    return processedTvShows
  } catch (error) {
    console.error("An error occurred while fetching the data:", error)
    return null
  }
})

