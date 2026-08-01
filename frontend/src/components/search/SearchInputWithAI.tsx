import React, { useState, useEffect, useRef } from 'react';
import { Search, Music, ArrowRight, Loader2 } from 'lucide-react';
import { searchService } from '../../services/searchService';
import { JioSaavnSong } from '../../types';

interface SearchInputWithAIProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (q: string) => void;
  placeholder?: string;
}

interface SongSuggestion {
  id: string;
  text: string;
  subtitle?: string;
  artworkUrl?: string;
}

export const SearchInputWithAI: React.FC<SearchInputWithAIProps> = ({
  query,
  setQuery,
  onSearch,
  placeholder = "Search songs, artists, playlists...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [songSuggestions, setSongSuggestions] = useState<SongSuggestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Count characters typed
  const charCount = query.trim().length;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch song recommendations when user types 2 or more characters
  useEffect(() => {
    if (charCount < 2) {
      setSongSuggestions([]);
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        const cleanQuery = query.trim();
        
        // Fetch live song recommendations from JioSaavn API
        let liveTracks: SongSuggestion[] = [];
        try {
          const res = await searchService.searchJioSaavnSongs(cleanQuery, 6);
          if (res && res.songs) {
            liveTracks = res.songs.slice(0, 6).map((song: JioSaavnSong) => ({
              id: `track-${song.id}`,
              text: song.name,
              subtitle: `${song.artistName} - ${song.albumName || 'Single'}`,
              artworkUrl: song.artworkUrl,
            }));
          }
        } catch {
          // Fallback gracefully if live API is slow
        }

        setSongSuggestions(liveTracks);
      } catch (err) {
        console.error('Failed to get song recommendations:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, charCount]);

  const handleSelectSuggestion = (suggestionText: string) => {
    setQuery(suggestionText);
    onSearch(suggestionText);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full md:w-96">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="w-5 h-5 text-muted absolute left-4 top-3.5 z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (charCount >= 2 && songSuggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 rounded-md bg-canvas border border-hairline text-ink text-sm focus:outline-none focus:border-primary transition-colors shadow-sm placeholder:text-muted"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-4 rounded-md bg-primary hover:bg-body-strong text-white font-semibold text-xs transition-colors"
        >
          Search
        </button>
      </form>

      {/* Song Recommendation Dropdown */}
      {isOpen && (charCount >= 2 || songSuggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-canvas border border-hairline rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Badge */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-soft border-b border-hairline">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Music className="w-3.5 h-3.5 text-brand-pink" />
              <span>Matching Songs</span>
            </div>
          </div>

          {/* Body List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-hairline/50">
            {isSearching ? (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted">
                <Loader2 className="w-4 h-4 animate-spin text-brand-pink" />
                <span>Searching songs...</span>
              </div>
            ) : songSuggestions.length > 0 ? (
              songSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(item.text)}
                  className="w-full text-left px-4 py-3 hover:bg-surface-soft transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {item.artworkUrl ? (
                      <img
                        src={item.artworkUrl}
                        alt={item.text}
                        className="w-8 h-8 rounded object-cover border border-hairline shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-surface-card border border-hairline flex items-center justify-center shrink-0">
                        <Music className="w-4 h-4 text-ink" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink group-hover:text-brand-pink transition-colors truncate">
                        {item.text}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-muted truncate">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-ink transition-transform group-hover:translate-x-1 shrink-0" />
                </button>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-muted">
                No matching songs found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
