import { withCache } from "@/lib/cache";

// Example: /api/tv/details
export async function POST(req: Request) {
    const { ids } = await req.json(); // Expect an array of IDs
    return withCache(async () => {
      const results = await Promise.all(
        ids.map(async (id: string) => {
          const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&append_to_response=credits,videos,images,keywords,recommendations`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch MOVIE details for ID ${id}`);
          return response.json();
        })
      );
      return new Response(JSON.stringify(results), { status: 200 });
    }, `movie:${ids}:details`, 86400)
   
  }