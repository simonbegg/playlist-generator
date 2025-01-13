import axios from 'axios';
import { tidalConfig } from './api-config';

// Create an axios instance for Tidal API
export const tidalClient = axios.create({
  baseURL: tidalConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication
tidalClient.interceptors.request.use(async (config) => {
  // TODO: Implement Tidal OAuth token management
  return config;
});

// Response interceptor for error handling
tidalClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: Implement proper error handling
    return Promise.reject(error);
  }
);
