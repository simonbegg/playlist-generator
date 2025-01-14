'use client';

import PlaylistGenerator from '@/components/PlaylistGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            AI Playlist Generator
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-12">
            Describe your perfect playlist and let AI help you create it
          </p>
          
          <PlaylistGenerator />
        </div>
      </div>
    </main>
  );
}
