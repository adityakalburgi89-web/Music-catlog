import { api } from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async loginWithGoogle(email: string, name: string, googleId?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', { email, name, googleId });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },


  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  },
};
