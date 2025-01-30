import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ids } = await req.json();
  
  if (!Array.isArray(ids)) {
   try {
       const url =`https://api.themoviedb.org/3/person/${ids}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=changes,combined_credits,external_ids,images,latest,movie_credits,tv_credits,tagged_images,translations`;
       
       const response = await fetch(url);
       
       if (!response.ok) {
         throw new Error(`Failed to fetch TV for ID ${ids}`);
       }
       
       const data = await response.json();
       return NextResponse.json(data);
       
     } catch (error) {
       console.error('API Error:', error);
       return NextResponse.json(
         { error: 'Failed to fetch TV show data' },
         { status: 500 }
       );
     }
  }

  const results = await Promise.all(
    ids.map(async (id: string) => {
      const url = `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=changes,combined_credits,external_ids,images,latest,movie_credits,tv_credits,tagged_images,translations`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch TV details for ID ${id}`);
      return response.json();
    })
  );
  
  return new Response(JSON.stringify(results), { status: 200 });
}