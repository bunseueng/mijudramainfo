import { withCache } from "@/lib/cache";

// Example: /api/tv/details
export async function POST(req: Request) {
    const { ids } = await req.json(); // Expect an array of IDs
      const results = await Promise.all(
        ids.map(async (id: string) => {
          const url = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch TV details for ID ${id}`);
          return response.json();
        })
      );
      return new Response(JSON.stringify(results), { status: 200 });
   
  }

