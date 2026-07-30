export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface ITunesAlbum {
  itunesCollectionId: number;
  title: string;
  artist: string;
  genre: string;
  releaseDate: string;
  trackCount: number;
  price: number;
  artworkUrl: string;
  country?: string;
  isSavedInLibrary?: boolean;
}

export interface ITunesSearchResponse {
  query: string;
  page: number;
  limit: number;
  totalResults: number;
  resultCount: number;
  albums: ITunesAlbum[];
}

export interface SavedAlbum {
  id: number;
  itunesCollectionId: number;
  title: string;
  artist: string;
  genre: string;
  releaseDate: string;
  trackCount: number;
  price: number;
  artworkUrl: string;
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryPageResponse {
  content: SavedAlbum[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
}

export interface AlbumSaveRequest {
  itunesCollectionId: number;
  title: string;
  artist: string;
  genre: string;
  releaseDate?: string;
  trackCount: number;
  price?: number;
  artworkUrl?: string;
  rating?: number;
  notes?: string;
}

export interface AlbumUpdateRequest {
  rating?: number;
  notes?: string;
}

export interface GenreDistribution {
  genre: string;
  count: number;
  percentage: number;
}

export interface DecadeDistribution {
  decade: string;
  count: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface ArtistDistribution {
  artist: string;
  albumCount: number;
}

export interface AnalyticsResponse {
  totalSavedAlbums: number;
  totalTracks: number;
  averageTrackCount: number;
  averageRating: number;
  genreDistribution: GenreDistribution[];
  releaseDecadeDistribution: DecadeDistribution[];
  ratingDistribution: RatingDistribution[];
  topArtists: ArtistDistribution[];
}

export interface TrendSummaryResponse {
  musicPersona: string;
  summary: string;
  topDominantDecade: string;
  keyObservations: string[];
  recommendedGenresToExplore: string[];
  generatedAt: string;
}
