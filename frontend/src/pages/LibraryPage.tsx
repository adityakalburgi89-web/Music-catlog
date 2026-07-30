import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { LibraryPageResponse, AlbumUpdateRequest } from '../types';
import { LibraryAlbumGrid } from '../components/library/LibraryAlbumGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Library, Filter, ArrowUpDown, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LibraryPage: React.FC = () => {
  const [data, setData] = useState<LibraryPageResponse | null>(null);
  const [genre, setGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [order, setOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLibrary = async () => {
    setIsLoading(true);
    try {
      const res = await libraryService.getLibrary(genre || undefined, sortBy, order, page, 12);
      setData(res);
    } catch (err) {
      console.error('Failed to load user library:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [genre, sortBy, order, page]);

  const handleUpdateAlbum = async (id: number, updateData: AlbumUpdateRequest) => {
    await libraryService.updateAlbum(id, updateData);
    fetchLibrary();
  };

  const handleDeleteAlbum = async (id: number) => {
    await libraryService.deleteAlbum(id);
    fetchLibrary();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-400" />
            My Personal Catalog
          </h1>
          <p className="text-slate-400 text-sm">View, rate, add notes, and manage your saved albums.</p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Genre filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                setPage(1);
              }}
              placeholder="Filter genre..."
              className="bg-transparent focus:outline-none w-28 text-slate-100 placeholder:text-slate-600"
            />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-100 cursor-pointer"
            >
              <option value="createdAt" className="bg-slate-900">Date Added</option>
              <option value="rating" className="bg-slate-900">User Rating</option>
              <option value="title" className="bg-slate-900">Album Title</option>
              <option value="artist" className="bg-slate-900">Artist</option>
              <option value="releaseDate" className="bg-slate-900">Release Date</option>
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors uppercase"
          >
            {order}
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Retrieving your catalog..." />
      ) : (
        <>
          {data && data.content.length > 0 ? (
            <LibraryAlbumGrid
              albums={data.content}
              onUpdate={handleUpdateAlbum}
              onDelete={handleDeleteAlbum}
            />
          ) : (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-8 max-w-md mx-auto">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-200">Your Library is Empty</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                You haven't saved any albums yet. Search the iTunes catalog to add your favorite albums!
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/30"
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
