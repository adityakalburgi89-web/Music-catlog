import { api } from './api';
import { AlbumSearchResponse, JioSaavnSearchResponse } from '../types';

export const searchService = {
  async searchAlbums(query: string, limit = 12): Promise<AlbumSearchResponse> {
    const response = await api.get<AlbumSearchResponse>('/search', {
      params: { query, type: 'album', limit },
    });
    return response.data;
  },

  async searchJioSaavnSongs(query: string, limit = 12): Promise<JioSaavnSearchResponse> {
    const response = await api.get<JioSaavnSearchResponse>('/search/jiosaavn/songs', {
      params: { query, limit },
    });
    return response.data;
  },

  async searchJioSaavnPlaylists(query: string, limit = 12): Promise<JioSaavnSearchResponse> {
    const response = await api.get<JioSaavnSearchResponse>('/search/jiosaavn/playlists', {
      params: { query, limit },
    });
    return response.data;
  },
};
