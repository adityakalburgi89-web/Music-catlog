import React, { createContext, useContext, useState } from 'react';

export interface ActiveTrack {
  id?: string | number;
  title: string;
  artist: string;
  album?: string;
  artworkUrl?: string;
  downloadUrl?: string;
}

interface PlayerContextType {
  currentTrack: ActiveTrack | null;
  isPlaying: boolean;
  playTrack: (track: ActiveTrack) => void;
  togglePlayPause: () => void;
  setPlayingState: (playing: boolean) => void;
  pauseTrack: () => void;
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<ActiveTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playTrack = (track: ActiveTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const setPlayingState = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resetPlayer = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        togglePlayPause,
        setPlayingState,
        pauseTrack,
        resetPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
