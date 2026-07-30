export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface ITunesAlbum {
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre: string;
  releaseDate: string;
  trackCount: number;
  collectionPrice: number;
  artworkUrl: string;
  saved?: boolean;
}

export interface AlbumSearchResponse {
  query: string;
  totalResults: number;
  resultCount: number;
  albums: ITunesAlbum[];
}

export interface SavedAlbum {
  id: number;
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre: string;
  releaseDate: string;
  trackCount: number;
  collectionPrice: number;
  artworkUrl: string;
  userRating?: number;
  userNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryPageResponse {
  content: SavedAlbum[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AlbumCreateRequest {
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre: string;
  releaseDate?: string;
  trackCount: number;
  collectionPrice?: number;
  artworkUrl?: string;
  userRating?: number;
  userNotes?: string;
}

export interface AlbumUpdateRequest {
  userRating?: number;
  userNotes?: string;
}

export interface AnalyticsResponse {
  totalAlbums: number;
  averageRating: number;
  averageTrackCount: number;
  albumsByGenre: Record<string, number>;
  albumsByArtist: Record<string, number>;
  releasesByYear: Record<number, number>;
  ratingDistribution: Record<number, number>;
  trackCountDistribution: Record<string, number>;
  recentlyAddedAlbums: SavedAlbum[];
}

export interface TrendSummaryResponse {
  musicPersona: string;
  summary: string;
  topDominantDecade: string;
  keyObservations: string[];
  recommendedGenresToExplore: string[];
  generatedAt: string;
}
