import { ITmdbDrama, PersonType } from "@/helper/type";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch a list of TV shows to get their tv_id
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN&without_genres=16,10764,10767,99`);

    // Check if the response is ok
    if (!response.ok) {
        throw new Error("Failed to fetch TV shows");
    }

    // Parse the response to get the list of TV shows
    const data = await response.json();
    const tvShows = data.results;

    // Generate sitemap entries for each TV show
    const sitemapEntries = tvShows.map((tvShow: ITmdbDrama) => ({
        url: `${process.env.BASE_URL}/tv/${tvShow.id}`,
    }));
    
    const tvIds = tvShows.map((show: any) => show.id);
     // Fetch keywords for each TV show using their tv_id
     const keywordPromises = tvIds.map(async (tv_id: number) => {
        const keywordResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${tv_id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );

        if (!keywordResponse.ok) {
          throw new Error(`Failed to fetch keywords for TV show with id ${tv_id}`);
        }

        const keywordData = await keywordResponse.json();
        return {
          tv_id,
          keywords: keywordData.results,
        };
    });

    const tvShowsWithKeywords = await Promise.all(keywordPromises);

    // Map keywords to sitemap entries
    const tvKeywordsEntries = tvShowsWithKeywords.flatMap(({ keywords }) => {
        return keywords.map((keyword: any) => ({
            url: `${process.env.BASE_URL}/keyword/${keyword.id}/tv`,
        }));
    });

    // Push keyword-related URLs to the sitemap
    sitemapEntries.push(...tvKeywordsEntries);

    if(response.ok) {
        const tvPhotoEntries = tvShows.map((tv: ITmdbDrama) => ({
            url: `${process.env.BASE_URL}/tv/${tv.id}/photos`,
        }));
        const tvMediaEntries = tvShows.map((tv: ITmdbDrama) => ({
            url: `${process.env.BASE_URL}/tv/${tv.id}/media`,
        }));
        const tvReviewEntries = tvShows.map((tv: ITmdbDrama) => ({
            url: `${process.env.BASE_URL}/tv/${tv.id}/reviews`,
        }));
        const tvSeasonEntries = tvShows.map((tv: ITmdbDrama) => ({
            url: `${process.env.BASE_URL}/tv/${tv.id}/seasons`,
        }));
        const tvCastEntries = tvShows.map((tv: ITmdbDrama) => ({
            url: `${process.env.BASE_URL}/tv/${tv.id}/cast`,
        }));

        // Add movie entries to the sitemap
        sitemapEntries.push(...tvPhotoEntries, ...tvMediaEntries, ...tvReviewEntries, ...tvSeasonEntries, ...tvCastEntries);
    }

    // Fetch additional data for movies
    const movieResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=CN`);
    
    if (movieResponse.ok) {
        const movieData = await movieResponse.json();
        const movies = movieData.results;    
        const movieId = movies.map((show: any) => show.id);
        // Fetch keywords for each TV show using their movie_id
        const keywordPromises = movieId.map(async (movie_id: number) => {
           const keywordResponse = await fetch(
             `https://api.themoviedb.org/3/movie/${movie_id}/keywords?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
           );
   
           if (!keywordResponse.ok) {
             throw new Error(`Failed to fetch keywords for movie with id ${movie_id}`);
           }
   
           const keywordData = await keywordResponse.json();
           return {
             movie_id,
             keywords: keywordData.keywords,
           };
       });
   
       const movieWithKeywords = await Promise.all(keywordPromises);
   
       // Map keywords to sitemap entries
       const tvKeywordsEntries = movieWithKeywords.flatMap(({ keywords }) => {
           return keywords.map((keyword: any) => ({
               url: `${process.env.BASE_URL}/keyword/${keyword.id}/movie`,
           }));
       });

        // Generate sitemap entries for each movie
        const movieEntries = movies.map((movie: ITmdbDrama) => ({
            url: `${process.env.BASE_URL}/movie/${movie.id}`,
        }));
        const movieCastEntries = movies.map((movie: ITmdbDrama) => ({
            url: `${process.env.BASE_URL}/movie/${movie.id}/cast`,
        }));

        // Add movie entries to the sitemap
        sitemapEntries.push(...movieEntries, ...movieCastEntries, ...tvKeywordsEntries);
    } else {
        console.error("Failed to fetch movies");
    }

    // Fetch trending persons
    const personResponse = await fetch(`https://api.themoviedb.org/3/trending/person/day?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`);
    
    if (personResponse.ok) {
        const personData = await personResponse.json();
        const persons = personData.results;

        // Generate sitemap entries for each person
        const personEntries = persons.map((person: PersonType) => ({
            url: `${process.env.BASE_URL}/person/${person.id}`,
        }));

        // Add person entries to the sitemap
        sitemapEntries.push(...personEntries);
    } else {
        console.error("Failed to fetch persons");
    }

    const networkResponse = await fetch(`https://api.themoviedb.org/3/network/2007?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`)
    if (networkResponse.ok) {
        const networkData = await networkResponse.json();
        // Generate sitemap entries for each person
        const networkEntries = {
            url: `${process.env.BASE_URL}/network/${networkData?.id}`,
        };

        // Add person entries to the sitemap
        sitemapEntries.push(networkEntries);
    } else {
        console.error("Failed to fetch network");
    }
    // Include any static pages as well
    sitemapEntries.push(
        { url: `${process.env.BASE_URL}/drama/newest` },
        { url: `${process.env.BASE_URL}/drama/top` },
        { url: `${process.env.BASE_URL}/drama/upcoming` },
        { url: `${process.env.BASE_URL}/drama/top_chinese_dramas` },
        { url: `${process.env.BASE_URL}/drama/top_korean_dramas` },
        { url: `${process.env.BASE_URL}/drama/top_japanese_dramas` },
        { url: `${process.env.BASE_URL}/movie/newest` },
        { url: `${process.env.BASE_URL}/movie/top` },
        { url: `${process.env.BASE_URL}/movie/upcoming` },
        { url: `${process.env.BASE_URL}/shows/variety` },
        { url: `${process.env.BASE_URL}/people/top` },
        { url: `${process.env.BASE_URL}/coin` },
        { url: `${process.env.BASE_URL}/signin` },
        { url: `${process.env.BASE_URL}/signup` },
        { url: `${process.env.BASE_URL}/faq` },
        { url: `${process.env.BASE_URL}/about` },
        { url: `${process.env.BASE_URL}/contact` },
        { url: `${process.env.BASE_URL}/terms` },
    );

    return sitemapEntries;
}
