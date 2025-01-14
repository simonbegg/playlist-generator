'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const description = searchParams.get('description');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-800 font-semibold mb-2">
            Error Code: {error}
          </p>
          {description && (
            <p className="text-red-700">
              {description}
            </p>
          )}
        </div>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
