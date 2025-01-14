import { NextResponse } from 'next/server';
import { authService } from '@/services/auth';

export async function GET() {
  try {
    const authUrl = await authService.getAuthUrl();
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
