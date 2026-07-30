import { api } from './api';
import { AlbumSearchResponse } from '../types';

export const searchService = {
  async searchAlbums(query: string, limit = 12): Promise<AlbumSearchResponse> {
    const response = await api.get<AlbumSearchResponse>('/search', {
      params: { query, type: 'album', limit },
    });
    return response.data;
  },
};
