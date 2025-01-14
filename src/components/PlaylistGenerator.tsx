'use client';

import { useState } from 'react';
import TrackSearch from './TrackSearch';
import { MusicalNoteIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Track {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  imageUrl?: string;
  tidalUrl?: string;
  matched: boolean;
  error?: string;
}

interface PlaylistResponse {
  tracks: Track[];
  description: string;
}

export default function PlaylistGenerator() {
  const [description, setDescription] = useState('');
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([]);
  const [playlistDescription, setPlaylistDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleGenerateSuggestions = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuggestedTracks([]);
    setPlaylistDescription('');
    setStatus('Generating track suggestions with AI...');
    setProgress(0);

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      const data: PlaylistResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      setSuggestedTracks(data.tracks);
      setPlaylistDescription(data.description || '');
      setStatus(data.tracks.length > 0 ? '' : 'No tracks found');
    } catch (error: any) {
      console.error('Generation error:', error);
      setError(error.message || 'Failed to generate suggestions');
      setStatus('');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your playlist (e.g., 'calm electronic for study')"
          className="w-full px-4 py-3 bg-white/10 border border-purple-300/20 rounded-lg text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm resize-none h-24"
        />
        <button
          onClick={handleGenerateSuggestions}
          disabled={isLoading || !description.trim()}
          className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Generating suggestions...' : 'Generate Suggestions'}
        </button>
      </div>

      {status && (
        <div className="p-4 mb-8 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-200 text-center backdrop-blur-sm">
          {status}
        </div>
      )}

      {error && (
        <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      {suggestedTracks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Suggested Tracks
            {isLoading && (
              <span className="text-sm font-normal text-purple-200 ml-2">
                (Finding tracks {suggestedTracks.length}/4)
              </span>
            )}
          </h2>
          
          {playlistDescription && (
            <div className="p-4 mb-4 bg-purple-500/5 border border-purple-300/10 rounded-lg text-purple-100 backdrop-blur-sm">
              {playlistDescription}
            </div>
          )}

          <ul className="space-y-3">
            {suggestedTracks.map((track, index) => (
              <li
                key={index}
                className="p-4 bg-white/5 border border-purple-300/10 rounded-lg hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  {track.imageUrl ? (
                    <img
                      src={track.imageUrl}
                      alt={`${track.title} album art`}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-purple-500/20 flex items-center justify-center">
                      <MusicalNoteIcon className="w-8 h-8 text-purple-200/70" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="font-medium text-white">{track.title}</div>
                    <div className="text-sm text-purple-200/70">{track.artist}</div>
                    {track.album && (
                      <div className="text-sm text-purple-200/50">{track.album}</div>
                    )}
                    {track.error && (
                      <div className="flex items-center mt-1 text-sm text-red-300">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {track.error}
                      </div>
                    )}
                  </div>
                  {track.matched && track.tidalUrl && (
                    <a
                      href={track.tidalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900 transition-colors duration-200"
                    >
                      Open in Tidal
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-8 border-t border-purple-300/20">
        <h2 className="text-xl font-semibold text-white mb-4">Search Tracks</h2>
        <TrackSearch />
      </div>
    </div>
  );
}
