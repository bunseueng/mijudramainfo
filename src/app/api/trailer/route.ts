export async function POST(req: Request) {
    try {
      const { ids } = await req.json();
      const api = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  
      if (!ids?.length) {
        return new Response(JSON.stringify([]), { status: 200 });
      }
  
      const results = await Promise.all(
        ids.map(async (id: string) => {
          const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${api}`;
          const response = await fetch(url, { next: { revalidate: 3600 } });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch video details for ID ${id}`);
          }
          
          return response.json();
        })
      );
  
      return new Response(JSON.stringify(results), { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      });
    } catch (error) {
      console.error('Error in trailer API:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch video details' }), { 
        status: 500 
      });
    }
  }