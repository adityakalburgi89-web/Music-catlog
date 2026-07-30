import React, { useState } from 'react';
import { ITunesAlbum } from '../../types';
import { BookmarkCheck, Plus, Calendar, Disc, DollarSign } from 'lucide-react';

interface AlbumSearchCardProps {
  album: ITunesAlbum;
  index: number;
  onSave: (album: ITunesAlbum) => Promise<void>;
}

// 6-Color Clay Saturated Palette Cycle
const CARD_PALETTES = [
  { bg: 'bg-brand-pink', text: 'text-white', textMuted: 'text-pink-100', badgeBg: 'bg-white/20 text-white', btnBg: 'bg-white text-ink hover:bg-slate-100', savedBtn: 'bg-white/30 text-white' },
  { bg: 'bg-brand-teal', text: 'text-white', textMuted: 'text-teal-100', badgeBg: 'bg-white/20 text-white', btnBg: 'bg-white text-ink hover:bg-slate-100', savedBtn: 'bg-white/30 text-white' },
  { bg: 'bg-brand-lavender', text: 'text-ink', textMuted: 'text-slate-700', badgeBg: 'bg-ink/10 text-ink', btnBg: 'bg-primary text-white hover:bg-body-strong', savedBtn: 'bg-ink/20 text-ink' },
  { bg: 'bg-brand-peach', text: 'text-ink', textMuted: 'text-slate-800', badgeBg: 'bg-ink/10 text-ink', btnBg: 'bg-primary text-white hover:bg-body-strong', savedBtn: 'bg-ink/20 text-ink' },
  { bg: 'bg-brand-ochre', text: 'text-ink', textMuted: 'text-slate-800', badgeBg: 'bg-ink/10 text-ink', btnBg: 'bg-primary text-white hover:bg-body-strong', savedBtn: 'bg-ink/20 text-ink' },
  { bg: 'bg-surface-card border border-hairline', text: 'text-ink', textMuted: 'text-muted', badgeBg: 'bg-surface-strong text-ink', btnBg: 'bg-primary text-white hover:bg-body-strong', savedBtn: 'bg-emerald-500/20 text-emerald-800' },
];

export const AlbumSearchCard: React.FC<AlbumSearchCardProps> = ({ album, index, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(album.saved || false);

  const palette = CARD_PALETTES[index % CARD_PALETTES.length];

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
    <div className={`group relative ${palette.bg} rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between overflow-hidden`}>
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${palette.badgeBg}`}>
            {album.genre || 'Music'}
          </span>
          <span className={`text-xs font-medium ${palette.textMuted}`}>
            #{album.appleCatalogId}
          </span>
        </div>

        {/* Artwork & Album Title Fragment */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={album.artworkUrl || 'https://via.placeholder.com/300?text=No+Artwork'}
            alt={album.title}
            className="w-20 h-20 rounded-lg object-cover shadow-md shrink-0 border border-black/10 group-hover:scale-105 transition-transform"
          />
          <div className="overflow-hidden">
            <h3 className={`font-display font-medium text-lg leading-snug line-clamp-2 ${palette.text}`} title={album.title}>
              {album.title}
            </h3>
            <p className={`text-xs font-medium line-clamp-1 mt-1 ${palette.textMuted}`}>
              {album.artistName}
            </p>
          </div>
        </div>

        {/* Product UI Fragment Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs font-medium mb-5 p-3 rounded-lg bg-black/5">
          <div className={`flex items-center gap-1.5 ${palette.text}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${palette.text}`}>
            <Disc className="w-3.5 h-3.5" />
            <span>{album.trackCount} Tracks</span>
          </div>
          {album.collectionPrice !== undefined && album.collectionPrice > 0 && (
            <div className={`flex items-center gap-1 font-bold col-span-2 ${palette.text}`}>
              <DollarSign className="w-3.5 h-3.5" />
              <span>{album.collectionPrice.toFixed(2)} USD</span>
            </div>
          )}
        </div>
      </div>

      {/* Button CTA */}
      <button
        onClick={handleSave}
        disabled={saved || isSaving}
        className={`w-full py-3 px-4 rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
          saved ? palette.savedBtn : palette.btnBg
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
            {isSaving ? 'Saving...' : 'Save Album'}
          </>
        )}
      </button>
    </div>
  );
};
