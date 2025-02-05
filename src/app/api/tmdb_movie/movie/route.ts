import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ids } = await req.json();
  
  if (!Array.isArray(ids)) {
   try {
       const url = `https://api.themoviedb.org/3/movie/${ids}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=account_states,alternative_titles,changes,credits,external_ids,images,keywords,lists,recommendations,release_dates,reviews,similar,translations,videos,watch/providers`;
       
       const response = await fetch(url, { next: { revalidate: 3600 }});
       
       if (!response.ok) {
         throw new Error(`Failed to fetch movie for ID ${ids}`);
       }
       
       const data = await response.json();
       return NextResponse.json(data);
       
     } catch (error) {
       console.error('API Error:', error);
       return NextResponse.json(
         { error: 'Failed to fetch movie show data' },
         { status: 500 }
       );
     }
  }

  const results = await Promise.all(
    ids.map(async (id: string) => {
      const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=account_states,aggregate_credits,alternative_titles,changes,content_ratings,credits,episode_groups,external_ids,images,keywords,latest,lists,recommendations,reviews,screened_theatrically,similar,translations,videos,watch/providers&api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch movie details for ID ${id}`);
      return response.json();
    })
  );
  
  return new Response(JSON.stringify(results), { status: 200 });
}