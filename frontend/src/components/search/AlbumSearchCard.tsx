import React, { useState } from 'react';
import { ITunesAlbum } from '../../types';
import { BookmarkCheck, Plus, Calendar, Disc, DollarSign } from 'lucide-react';

interface AlbumSearchCardProps {
  album: ITunesAlbum;
  onSave: (album: ITunesAlbum) => Promise<void>;
}

export const AlbumSearchCard: React.FC<AlbumSearchCardProps> = ({ album, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(album.isSavedInLibrary || false);

  const handleSave = async () => {
    if (saved || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(album);
      setSaved(true);
    } catch (err) {
      console.error('Failed to save album:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : 'N/A';

  return (
    <div className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <img
          src={album.artworkUrl || 'https://via.placeholder.com/300?text=No+Artwork'}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-indigo-300">
          {album.genre || 'Music'}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors" title={album.title}>
            {album.title}
          </h3>
          <p className="text-sm font-medium text-slate-400 line-clamp-1 mb-3">
            {album.artist}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5 text-slate-500" />
              <span>{album.trackCount} Tracks</span>
            </div>
            {album.price !== undefined && album.price > 0 && (
              <div className="flex items-center gap-1 text-slate-300 font-semibold col-span-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>{album.price.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saved || isSaving}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            saved
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-95'
          }`}
        >
          {saved ? (
            <>
              <BookmarkCheck className="w-4 h-4" />
              Saved to Library
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save to Library'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
