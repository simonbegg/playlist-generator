import { NextResponse } from 'next/server';
import { authService } from '@/services/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('Auth error:', { error, errorDescription });
    return NextResponse.redirect(
      `/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (!code || !state) {
    console.error('Missing required parameters:', { code, state });
    return NextResponse.redirect('/error?error=missing_params&description=Authorization+code+or+state+is+missing');
  }

  try {
    const accessToken = await authService.exchangeCodeForToken(code, state);
    
    // Store the token in an HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('tidal_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.redirect(new URL('/?success=true', request.url));
  } catch (error: any) {
    console.error('Token exchange error:', error);
    const errorMessage = error.message || 'Failed to exchange token';
    return NextResponse.redirect(
      new URL(`/error?error=token_exchange_failed&description=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
