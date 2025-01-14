import axios from 'axios';

const TIDAL_TOKEN_URL = 'https://auth.tidal.com/v1/oauth2/token';

class TokenService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  async getToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    // Get new token
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.TIDAL_CLIENT_ID!,
      client_secret: process.env.TIDAL_CLIENT_SECRET!,
    });

    try {
      const response = await axios.post(TIDAL_TOKEN_URL, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.token = response.data.access_token;
      // Set expiry to slightly before the actual expiry time to be safe
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;

      return this.token;
    } catch (error) {
      console.error('Failed to get token:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const tokenService = new TokenService();
