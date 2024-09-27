
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url'); // Get the 'url' query parameter

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const results = await fetch(`https://v1.nocodeapi.com/jujingyi/link_preview/oiczlmCbOigEnXXW?url=${encodeURIComponent(url)}`)
      .then(r => r.json());

    return new Response(JSON.stringify(results), {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
