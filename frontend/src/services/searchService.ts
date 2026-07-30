import { api } from './api';
import { ITunesSearchResponse } from '../types';

export const searchService = {
  async searchAlbums(query: string, page = 1, limit = 12): Promise<ITunesSearchResponse> {
    const response = await api.get<ITunesSearchResponse>('/search', {
      params: { query, type: 'album', page, limit },
    });
    return response.data;
  },
};
