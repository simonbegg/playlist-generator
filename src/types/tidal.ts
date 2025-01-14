export interface TidalTrack {
  id: number;
  title: string;
  artist: {
    id: number;
    name: string;
  };
  album: {
    id: number;
    title: string;
  };
  duration: number;
  trackNumber: number;
  url: string;
}

export interface TidalSearchResponse {
  items: TidalTrack[];
  totalCount: number;
  limit: number;
  offset: number;
}
