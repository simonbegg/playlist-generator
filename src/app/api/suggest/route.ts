import { NextResponse } from "next/server";
import OpenAI from "openai";
import { tidalService } from "@/services/tidal";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const prompt = `Given the playlist description: "${description}", suggest exactly 4 tracks that would fit well together. 
    Return the response in this exact JSON format:
    {
      "tracks": [
        {
          "title": "track name",
          "artist": "artist name"
        }
      ],
      "description": "A brief description of the playlist and how it matches the mood"
    }
    Focus on creating a cohesive playlist that matches the mood and style described. Be very specific with track names and artist names.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    const suggestions = JSON.parse(response || '{"tracks": []}');

    if (!suggestions.tracks || suggestions.tracks.length === 0) {
      return NextResponse.json(
        { error: "No track suggestions generated" },
        { status: 400 }
      );
    }

    // Search Tidal for each suggested track sequentially
    const tidalResults = [];
    for (const [index, track] of suggestions.tracks.entries()) {
      try {
        // Add a delay between tracks to avoid rate limits
        if (index > 0) {
          await delay(1500); // 1.5 second delay between tracks
        }

        const searchQuery = `${track.title} ${track.artist}`;
        const searchResult = await tidalService.searchTrack(searchQuery);

        // Find the first track from the included tracks
        const bestMatch = searchResult.included?.find(
          (item) => item.type === "tracks"
        );

        if (bestMatch) {
          const imageUrl =
            bestMatch.attributes.imageUrl ||
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
          tidalResults.push({
            ...track,
            matched: false,
            error: "Track not found on Tidal",
          });
        }
      } catch (error: any) {
        let errorMessage = "Failed to search track";
        if (error.response?.status === 429) {
          errorMessage = "Too many requests, retrying...";
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }

        tidalResults.push({
          ...track,
          matched: false,
          error: errorMessage,
        });
      }
    }

    return NextResponse.json({ 
      tracks: tidalResults,
      description: suggestions.description 
    });
  } catch (error: any) {
    console.error("API error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.message || "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
