import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (email: string, name: string, googleId?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getCurrentUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await authService.login(email, password);
    setToken(response.token);
    setUser(response.user);
  };

  const loginWithGoogle = async (email: string, name: string, googleId?: string) => {
    const response: AuthResponse = await authService.loginWithGoogle(email, name, googleId);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const response: AuthResponse = await authService.register(email, password, name);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >

      {children}
    </AuthContext.Provider>
  );
};
