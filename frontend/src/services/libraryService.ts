import { api } from './api';
import { AlbumSaveRequest, AlbumUpdateRequest, AlbumResponse, LibraryPageResponse, SavedAlbum } from '../types';

export const libraryService = {
  async getLibrary(genre?: string, sortBy = 'createdAt', order = 'desc', page = 1, limit = 12): Promise<LibraryPageResponse> {
    const response = await api.get<LibraryPageResponse>('/library', {
      params: { genre, sortBy, order, page, limit },
    });
    return response.data;
  },

  async getAlbumById(id: number): Promise<SavedAlbum> {
    const response = await api.get<SavedAlbum>(`/library/${id}`);
    return response.data;
  },

  async saveAlbum(albumData: AlbumSaveRequest): Promise<SavedAlbum> {
    const response = await api.post<SavedAlbum>('/library', albumData);
    return response.data;
  },

  async updateAlbum(id: number, updateData: AlbumUpdateRequest): Promise<SavedAlbum> {
    const response = await api.put<SavedAlbum>(`/library/${id}`, updateData);
    return response.data;
  },

  async deleteAlbum(id: number): Promise<void> {
    await api.delete(`/library/${id}`);
  },
};
