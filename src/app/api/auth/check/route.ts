import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('tidal_token');
  
  return NextResponse.json({ 
    authenticated: !!token
  });
}
