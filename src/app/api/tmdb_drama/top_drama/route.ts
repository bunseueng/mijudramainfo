export async function POST(req: Request) {
  const { ids } = await req.json();

  const results = await Promise.all(
    ids.map(async (id: string) => {
      const url = `https://api.themoviedb.org/3/tv/${id}?append_to_response=account_states,aggregate_credits,alternative_titles,changes,content_ratings,credits,episode_groups,external_ids,images,keywords,latest,lists,recommendations,reviews,screened_theatrically,similar,translations,videos,watch/providers&api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
      const response = await fetch(url, { next: { revalidate: 3600 }});
      if (!response.ok) throw new Error(`Failed to fetch TV details for ID ${id}`);
      return response.json();
    })
  );
  
  return new Response(JSON.stringify(results), { status: 200 });
}