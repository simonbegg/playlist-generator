import { Configuration } from 'openai';

// OpenAI configuration
export const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tidal API configuration
export const tidalConfig = {
  clientId: process.env.TIDAL_CLIENT_ID,
  clientSecret: process.env.TIDAL_CLIENT_SECRET,
  baseURL: 'https://api.tidal.com/v1',
};

if (!process.env.OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.TIDAL_CLIENT_ID || !process.env.TIDAL_CLIENT_SECRET) {
  console.warn('Missing TIDAL API credentials in environment variables');
}
