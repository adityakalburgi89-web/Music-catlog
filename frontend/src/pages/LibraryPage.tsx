import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { LibraryPageResponse, AlbumUpdateRequest } from '../types';
import { LibraryAlbumGrid } from '../components/library/LibraryAlbumGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Library, ArrowUpDown, Music, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LibraryPage: React.FC = () => {
  const [data, setData] = useState<LibraryPageResponse | null>(null);
  const [sort, setSort] = useState<string>('createdAt,desc');
  const [page] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLibrary = async () => {
    setIsLoading(true);
    try {
      const res = await libraryService.getLibrary('createdAt', 'desc', page + 1, 12);
      setData(res);
    } catch (err) {
      console.error('Failed to load user library:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [sort, page]);

  const handleUpdateAlbum = async (id: number, updateData: AlbumUpdateRequest) => {
    await libraryService.updateAlbum(id, updateData);
    fetchLibrary();
  };

  const handleDeleteAlbum = async (id: number) => {
    await libraryService.deleteAlbum(id);
    fetchLibrary();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Band */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold mb-3 border border-brand-teal/20">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Database
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink flex items-center gap-3">
            <Library className="w-8 h-8 text-ink" />
            My Personal Catalog
          </h1>
          <p className="text-body text-sm mt-1">View, rate, add notes, and organize your saved music library.</p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 bg-surface-soft border border-hairline rounded-md px-3.5 py-2 text-xs font-medium text-ink">
          <ArrowUpDown className="w-4 h-4 text-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent focus:outline-none text-ink font-semibold cursor-pointer"
          >
            <option value="createdAt,desc">Date Added (Newest)</option>
            <option value="userRating,desc">User Rating (Highest)</option>
            <option value="title,asc">Album Title (A-Z)</option>
            <option value="artistName,asc">Artist Name (A-Z)</option>
            <option value="releaseDate,desc">Release Date (Newest)</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Retrieving your saved album collection..." />
      ) : (
        <>
          {data && data.content.length > 0 ? (
            <LibraryAlbumGrid
              albums={data.content}
              onUpdate={handleUpdateAlbum}
              onDelete={handleDeleteAlbum}
            />
          ) : (
            <div className="text-center py-20 bg-surface-card rounded-xl border border-hairline p-8 max-w-md mx-auto">
              <Music className="w-12 h-12 text-muted mx-auto mb-3" />
              <h3 className="font-display font-medium text-lg text-ink">Your Library is Empty</h3>
              <p className="text-xs text-muted mt-1 mb-6">
                Save albums from iTunes search to build your personal database and view analytics.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary hover:bg-body-strong text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Go to iTunes Search
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};
