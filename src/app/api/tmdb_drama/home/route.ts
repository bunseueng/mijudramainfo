import { NextResponse } from "next/server";

// Example: /api/tv/details
const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json()

    const urls = {
      trending: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN&with_original_language=zh&without_genres=16,10764,35`,
      latest: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&first_air_date_year=2024&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=first_air_date.desc&with_origin_country=CN&with_original_language=zh&without_genres=16,10764,10767,35`,
      iqiyi: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=1330&without_genres=16,10764,10767,35`,
      youku: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=1419&without_genres=16,10764,10767,35`,
      tencent: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=2007&without_genres=16,10764,10767,35`,
      mongotv: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_networks=1631&without_genres=16,10764,10767,35`,
      korean: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&with_origin_country=KR&without_genres=16,10764,10767,35`,
      japanese: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&with_origin_country=JP&without_genres=16,10764,10767,35`,
      chineseAnime: `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&with_genres=16&with_origin_country=CN`
    };

    // Fetch all drama sections in parallel
    const results = await Promise.all(
      Object.entries(urls).map(async ([key, url]) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${key}`);
        const data = await response.json();
        return { key, data: data.results };
      })
    );

    // Get top 5 shows from trending to fetch cast
    const trendingShows = results.find(r => r.key === 'trending')?.data.slice(0, 5) || [];
    
    // Fetch cast data for top shows
    const castPromises = trendingShows.map((show: any) => 
      fetch(`${BASE_URL}/tv/${show.id}/aggregate_credits?api_key=${TMDB_API_KEY}`)
        .then(res => res.json())
        .then(data => data.cast || [])
    );

    const castData = await Promise.all(castPromises);

    // Process cast data to get unique actors
    const uniqueActors = new Map();
    castData.flat().forEach(actor => {
      if (actor.profile_path && !uniqueActors.has(actor.id)) {
        uniqueActors.set(actor.id, {
          id: actor.id,
          name: actor.name,
          profile_path: actor.profile_path,
          character: actor.roles?.[0]?.character || '',
          order: actor.order,
          popularity: actor.popularity,
        });
      }
    });

    // Convert actors map to sorted array
    const actors = Array.from(uniqueActors.values())
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);

    // Combine all results
    const responseData = {
      ...Object.fromEntries(results.map(({ key, data }) => [key, data])),
      actors
    };

    return NextResponse.json({responseData}, {status: 200})
  } catch (error) {
    console.error('Error in /api/tmdb/home:', error);
    return NextResponse.json({ error: 'Internal server error' }, {status: 500});
  }
  }