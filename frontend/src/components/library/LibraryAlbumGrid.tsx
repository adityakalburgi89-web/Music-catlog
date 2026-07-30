import React, { useState } from 'react';
import { SavedAlbum, AlbumUpdateRequest } from '../../types';
import { Star, Edit3, Trash2, Calendar, Disc } from 'lucide-react';
import { EditAlbumModal } from './EditAlbumModal';

interface LibraryAlbumGridProps {
  albums: SavedAlbum[];
  onUpdate: (id: number, updateData: AlbumUpdateRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const LibraryAlbumGrid: React.FC<LibraryAlbumGridProps> = ({ albums, onUpdate, onDelete }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<SavedAlbum | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to remove this album from your personal library?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => {
          const formattedDate = album.releaseDate
            ? new Date(album.releaseDate).getFullYear()
            : 'N/A';

          return (
            <div
              key={album.id}
              className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square overflow-hidden bg-slate-800">
                  <img
                    src={album.artworkUrl || 'https://via.placeholder.com/300?text=No+Artwork'}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                  {/* Rating badge */}
                  {album.rating && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{album.rating}.0</span>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-indigo-300">
                    {album.genre}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-base text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors" title={album.title}>
                    {album.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 line-clamp-1 mb-3">
                    {album.artist}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Disc className="w-3.5 h-3.5 text-slate-500" />
                      <span>{album.trackCount} Tracks</span>
                    </div>
                  </div>

                  {album.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 line-clamp-2 italic mb-2">
                      "{album.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => setSelectedAlbum(album)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  Edit Notes
                </button>
                <button
                  onClick={() => handleDelete(album.id)}
                  disabled={deletingId === album.id}
                  className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center transition-colors"
                  title="Remove from library"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAlbum && (
        <EditAlbumModal
          album={selectedAlbum}
          isOpen={!!selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          onSave={onUpdate}
        />
      )}
    </>
  );
};
