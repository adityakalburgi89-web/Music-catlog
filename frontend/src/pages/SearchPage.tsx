import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { libraryService } from '../services/libraryService';
import { ITunesAlbum, ITunesSearchResponse } from '../types';
import { AlbumSearchCard } from '../components/search/AlbumSearchCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, Music, ChevronLeft, ChevronRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('Daft Punk');
  const [activeQuery, setActiveQuery] = useState('Daft Punk');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ITunesSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSearchResults = async (q: string, p: number) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await searchService.searchAlbums(q, p, 12);
      setData(res);
    } catch (err) {
      setError('Failed to search iTunes catalog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(activeQuery, page);
  }, [activeQuery, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== activeQuery) {
      setPage(1);
      setActiveQuery(query.trim());
    }
  };

  const handleSaveAlbum = async (album: ITunesAlbum) => {
    await libraryService.saveAlbum({
      itunesCollectionId: album.itunesCollectionId,
      title: album.title,
      artist: album.artist,
      genre: album.genre || 'Uncategorized',
      releaseDate: album.releaseDate ? album.releaseDate.split('T')[0] : undefined,
      trackCount: album.trackCount || 0,
      price: album.price,
      artworkUrl: album.artworkUrl,
    });
  };

  const totalPages = data ? Math.ceil(data.totalResults / 12) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">iTunes Album Search</h1>
        <p className="text-slate-400 text-sm">Discover albums from the global iTunes catalog and save them to your library.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
        <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by artist, album title, or genre (e.g. Pink Floyd, Renaissance, Jazz)..."
          className="w-full pl-12 pr-28 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-lg placeholder:text-slate-600"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md"
        >
          Search
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <LoadingSpinner label={`Searching iTunes for "${activeQuery}"...`} />
      ) : (
        <>
          {/* Results Grid */}
          {data && data.albums && data.albums.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Showing results for <strong className="text-slate-200">"{data.query}"</strong></span>
                <span>Found {data.totalResults} albums</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.albums.map((album) => (
                  <AlbumSearchCard key={album.itunesCollectionId} album={album} onSave={handleSaveAlbum} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-800/80">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-semibold text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            data && (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-8">
                <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">No Albums Found</h3>
                <p className="text-xs text-slate-500 mt-1">Try refining your search terms or genre names.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
