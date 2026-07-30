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
              className="group relative bg-surface-card border border-hairline rounded-lg overflow-hidden hover:border-ink/20 transition-all duration-300 flex flex-col justify-between p-5"
            >
              <div>
                <div className="relative aspect-square overflow-hidden rounded-md mb-4 bg-surface-strong">
                  <img
                    src={album.artworkUrl || 'https://via.placeholder.com/300?text=No+Artwork'}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {album.userRating && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{album.userRating}.0</span>
                    </div>
                  )}

                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-canvas/90 text-ink border border-hairline backdrop-blur-sm">
                    {album.genre}
                  </span>
                </div>

                <h3 className="font-display font-medium text-base text-ink line-clamp-1 group-hover:text-brand-pink transition-colors" title={album.title}>
                  {album.title}
                </h3>
                <p className="text-xs font-medium text-muted line-clamp-1 mb-3">
                  {album.artistName}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-soft" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Disc className="w-3.5 h-3.5 text-muted-soft" />
                    <span>{album.trackCount} Tracks</span>
                  </div>
                </div>

                {album.userNotes && (
                  <div className="p-3 rounded-md bg-canvas border border-hairline text-xs text-body line-clamp-2 italic mb-3">
                    "{album.userNotes}"
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-hairline">
                <button
                  onClick={() => setSelectedAlbum(album)}
                  className="flex-1 py-2 px-3 rounded-md bg-canvas hover:bg-surface-soft text-ink border border-hairline text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Notes & Rating
                </button>
                <button
                  onClick={() => handleDelete(album.id)}
                  disabled={deletingId === album.id}
                  className="py-2 px-3 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20 text-xs font-semibold flex items-center justify-center transition-colors"
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
