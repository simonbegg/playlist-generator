'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Track {
  id: string;
  title: string;
  artist: string;
}

export default function TrackSearch() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search tracks');
      }

      // Handle the included tracks data
      const includedTracks = data.included || [];
      setTracks(
        includedTracks
          .filter((item: any) => item.type === 'tracks')
          .map((track: any) => ({
            id: track.id,
            title: track.attributes.title,
            artist: track.attributes.artistName,
          }))
      );
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.message || 'Failed to search tracks');
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for tracks..."
            className="w-full px-4 py-3 pl-12 bg-white/10 border border-purple-300/20 rounded-lg text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-purple-200/70" />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-2 px-4 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {tracks.length > 0 ? (
          <ul className="space-y-3">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="group p-4 bg-white/5 border border-purple-300/10 rounded-lg hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-200 transition-colors duration-200">
                      {track.title}
                    </h3>
                    <p className="text-sm text-purple-200/70">
                      {track.artist}
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900 transition-all duration-200">
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : query && !isLoading ? (
          <div className="text-center text-purple-200/70">
            No tracks found
          </div>
        ) : null}
      </div>
    </div>
  );
}
