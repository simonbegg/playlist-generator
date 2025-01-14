import axios from 'axios';
import { TidalSearchResponse, TidalTrack } from '../types/tidal';
import { tokenService } from './token';

const TIDAL_API_URL = 'https://openapi.tidal.com/v2';
const RETRY_DELAY = 1000; // 1 second delay between retries
const MAX_RETRIES = 3;

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class TidalService {
  private async searchWithRetry(query: string, retryCount = 0): Promise<TidalSearchResponse> {
    try {
      // Add a small delay between requests
      if (retryCount > 0) {
        await delay(RETRY_DELAY);
      }

      const token = await tokenService.getToken();
      const response = await axios.get(
        `${TIDAL_API_URL}/searchresults/${encodeURIComponent(query)}/relationships/tracks`,
        {
          params: {
            countryCode: 'GB',
            include: 'tracks'
          },
          headers: {
            'accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        return this.searchWithRetry(query, retryCount + 1);
      }
      throw error;
    }
  }

  async searchTrack(query: string): Promise<TidalSearchResponse> {
    try {
      return await this.searchWithRetry(query);
    } catch (error) {
      console.error('Error searching Tidal:', error);
      throw error;
    }
  }

  private async getTrackWithRetry(trackId: number, retryCount = 0): Promise<TidalTrack> {
    try {
      // Add a small delay between requests
      if (retryCount > 0) {
        await delay(RETRY_DELAY);
      }

      const token = await tokenService.getToken();
      const response = await axios({
        method: 'GET',
        url: `${TIDAL_API_URL}/tracks/${trackId}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        return this.getTrackWithRetry(trackId, retryCount + 1);
      }
      throw error;
    }
  }

  async getTrack(trackId: number): Promise<TidalTrack> {
    try {
      return await this.getTrackWithRetry(trackId);
    } catch (error) {
      console.error(`Error in Tidal API request to /tracks/${trackId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const tidalService = new TidalService();
