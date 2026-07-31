import React, { useState } from 'react';
import { SavedAlbum, AlbumUpdateRequest } from '../../types';
import { X, Star, Save } from 'lucide-react';

interface EditAlbumModalProps {
  album: SavedAlbum;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updateData: AlbumUpdateRequest) => Promise<void>;
}

const FALLBACK_ARTWORK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='300' height='300' fill='%23242433'/><circle cx='150' cy='150' r='100' fill='%2312121a' stroke='%23333348' stroke-width='4'/><circle cx='150' cy='150' r='35' fill='%23e85d04'/><circle cx='150' cy='150' r='10' fill='%2312121a'/></svg>";

export const EditAlbumModal: React.FC<EditAlbumModalProps> = ({ album, isOpen, onClose, onSave }) => {
  const [userRating, setUserRating] = useState<number>(album.userRating || 5);
  const [userNotes, setUserNotes] = useState<string>(album.userNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(album.id, { userRating, userNotes });
      onClose();
    } catch (err) {
      console.error('Failed to update album notes:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
      <div className="bg-canvas border border-hairline rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md text-muted hover:text-ink hover:bg-surface-soft transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={album.artworkUrl || FALLBACK_ARTWORK}
            alt={album.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_ARTWORK;
            }}
            className="w-16 h-16 rounded-md object-cover border border-hairline shrink-0"
          />
          <div>
            <h3 className="font-display font-medium text-lg text-ink line-clamp-1">{album.title}</h3>
            <p className="text-xs text-muted font-medium">{album.artistName}</p>
            <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-peach/40 text-ink font-medium border border-brand-peach">
              {album.genre}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Your Rating (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-hairline'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-ink">{userRating} / 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Personal Listening Notes (max 1000 chars)
            </label>
            <textarea
              rows={4}
              maxLength={1000}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Write your thoughts, key tracks, or memories associated with this album..."
              className="w-full px-4 py-3 rounded-md bg-canvas border border-hairline text-ink text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-body hover:bg-surface-soft transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-primary hover:bg-body-strong text-white shadow-sm transition-all active:scale-95"
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
