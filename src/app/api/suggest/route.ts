import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tidalService } from '@/services/tidal';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const prompt = `Given the playlist description: "${description}", suggest 4 tracks that would fit well together. 
    Return the response in this exact JSON format:
    {
      "tracks": [
        {
          "title": "track name",
          "artist": "artist name"
        }
      ]
    }
    Focus on creating a cohesive playlist that matches the mood and style described. Be very specific with track names and artist names.`;

    console.log('Generating suggestions with OpenAI...');
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    const suggestions = JSON.parse(response || '{"tracks": []}');

    console.log('Got suggestions from OpenAI:', suggestions);

    // Search Tidal for each suggested track sequentially
    const tidalResults = [];
    for (const [index, track] of suggestions.tracks.entries()) {
      try {
        console.log(`Searching Tidal for track ${index + 1}:`, track);
        const searchQuery = `${track.title} ${track.artist}`;
        const searchResult = await tidalService.searchTrack(searchQuery);
        
        // Find the first track from the included tracks
        const bestMatch = searchResult.included?.find(item => item.type === 'tracks');
        
        if (bestMatch) {
          console.log(`Found match for track ${index + 1}:`, bestMatch);
          const imageUrl = bestMatch.attributes.imageUrl || 
                         bestMatch.attributes.albumImageUrl || 
                         bestMatch.attributes.artistImageUrl;
          
          tidalResults.push({
            ...track,
            id: bestMatch.id,
            album: bestMatch.attributes.albumTitle,
            artist: bestMatch.attributes.artistName,
            title: bestMatch.attributes.title,
            imageUrl,
            tidalUrl: `https://tidal.com/browse/track/${bestMatch.id}`,
            matched: true,
          });
        } else {
          console.log(`No match found for track ${index + 1}`);
          tidalResults.push({
            ...track,
            matched: false,
          });
        }
      } catch (error: any) {
        console.error('Tidal search error:', error.response?.data || error);
        tidalResults.push({
          ...track,
          matched: false,
          error: error.response?.data?.error || 'Failed to search track',
        });
      }
    }

    console.log('Final results:', tidalResults);
    return NextResponse.json({ tracks: tidalResults });
  } catch (error: any) {
    console.error('API error:', error.response?.data || error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
