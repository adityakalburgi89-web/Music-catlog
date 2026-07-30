import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { libraryService } from '../services/libraryService';
import { ITunesAlbum, AlbumSearchResponse } from '../types';
import { AlbumSearchCard } from '../components/search/AlbumSearchCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, Music, Sparkles } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('Daft Punk');
  const [activeQuery, setActiveQuery] = useState('Daft Punk');
  const [data, setData] = useState<AlbumSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSearchResults = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await searchService.searchAlbums(q, 12);
      setData(res);
    } catch (err) {
      setError('Failed to search iTunes catalog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(activeQuery);
  }, [activeQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== activeQuery) {
      setActiveQuery(query.trim());
    }
  };

  const handleSaveAlbum = async (album: ITunesAlbum) => {
    await libraryService.saveAlbum({
      appleCatalogId: album.appleCatalogId,
      title: album.title,
      artistName: album.artistName,
      genre: album.genre || 'Uncategorized',
      releaseDate: album.releaseDate ? album.releaseDate.split('T')[0] : undefined,
      trackCount: album.trackCount || 0,
      collectionPrice: album.collectionPrice,
      artworkUrl: album.artworkUrl,
    });
  };

  return (
    <div className="space-y-10 py-4">
      {/* Hero Header Band */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-hairline">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-peach/40 text-ink text-xs font-semibold mb-3 border border-brand-peach">
            <Sparkles className="w-3.5 h-3.5" />
            Global iTunes Catalog
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink">
            Discover unique music data
          </h1>
          <p className="mt-2 text-body text-base leading-relaxed">
            Search live album projects from the global iTunes API and curate your personal database.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-muted absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Daft Punk, Pink Floyd..."
            className="w-full pl-12 pr-24 py-3 rounded-md bg-canvas border border-hairline text-ink text-sm focus:outline-none focus:border-primary transition-colors shadow-sm placeholder:text-muted"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 rounded-md bg-primary hover:bg-body-strong text-white font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">
          {error}
        </div>
      )}

      {/* Loading & Grid Output */}
      {isLoading ? (
        <LoadingSpinner label={`Searching iTunes catalog for "${activeQuery}"...`} />
      ) : (
        <>
          {data && data.albums && data.albums.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Showing search results for <strong className="text-ink">"{data.query}"</strong></span>
                <span>Found {data.totalResults} matching albums</span>
              </div>

              {/* Saturated 3-Up Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.albums.map((album, idx) => (
                  <AlbumSearchCard
                    key={album.appleCatalogId}
                    album={album}
                    index={idx}
                    onSave={handleSaveAlbum}
                  />
                ))}
              </div>
            </div>
          ) : (
            data && (
              <div className="text-center py-20 bg-surface-soft rounded-xl border border-hairline p-8 max-w-md mx-auto">
                <Music className="w-12 h-12 text-muted mx-auto mb-3" />
                <h3 className="font-display font-medium text-lg text-ink">No Albums Found</h3>
                <p className="text-xs text-muted mt-1">Try searching for famous artists or album titles.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
