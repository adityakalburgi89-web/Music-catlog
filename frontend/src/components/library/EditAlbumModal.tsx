import React, { useState } from 'react';
import { SavedAlbum, AlbumUpdateRequest } from '../../types';
import { X, Star, Save } from 'lucide-react';

interface EditAlbumModalProps {
  album: SavedAlbum;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updateData: AlbumUpdateRequest) => Promise<void>;
}

export const EditAlbumModal: React.FC<EditAlbumModalProps> = ({ album, isOpen, onClose, onSave }) => {
  const [rating, setRating] = useState<number>(album.rating || 5);
  const [notes, setNotes] = useState<string>(album.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(album.id, { rating, notes });
      onClose();
    } catch (err) {
      console.error('Failed to update album notes:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={album.artworkUrl || 'https://via.placeholder.com/100'}
            alt={album.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-800"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-100 line-clamp-1">{album.title}</h3>
            <p className="text-sm text-slate-400">{album.artist}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              {album.genre}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Rating (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-amber-400">{rating} / 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Personal Listening Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your thoughts, key tracks, or memories associated with this album..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
