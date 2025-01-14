import { NextResponse } from 'next/server';
import axios from 'axios';
import { tokenService } from '@/services/token';

const TIDAL_API_URL = 'https://openapi.tidal.com/v2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const countryCode = searchParams.get('countryCode') || 'GB';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Get a valid token
    const token = await tokenService.getToken();

    const response = await axios.get(
      `${TIDAL_API_URL}/searchresults/${encodeURIComponent(query)}/relationships/tracks`, {
      params: {
        countryCode,
        include: 'tracks'
      },
      headers: {
        'accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in Tidal API request:', error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to search tracks' },
      { status: error.response?.status || 500 }
    );
  }
}
