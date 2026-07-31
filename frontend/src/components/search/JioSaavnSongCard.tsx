import React, { useState } from 'react';
import { JioSaavnSong } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { Play, BookmarkCheck, Plus, Clock, Music } from 'lucide-react';

interface JioSaavnSongCardProps {
  song: JioSaavnSong;
  index: number;
  onSave: (song: JioSaavnSong) => Promise<void>;
}

const FALLBACK_ARTWORK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='300' height='300' fill='%23242433'/><circle cx='150' cy='150' r='100' fill='%2312121a' stroke='%23333348' stroke-width='4'/><circle cx='150' cy='150' r='35' fill='%23e85d04'/><circle cx='150' cy='150' r='10' fill='%2312121a'/></svg>";

const SONG_CARD_PALETTES = [
  { bg: 'bg-brand-teal', text: 'text-white', textMuted: 'text-teal-100', badgeBg: 'bg-white/20 text-white', playBtn: 'bg-white text-ink hover:bg-slate-100', saveBtn: 'bg-white/20 text-white hover:bg-white/30' },
  { bg: 'bg-brand-pink', text: 'text-white', textMuted: 'text-pink-100', badgeBg: 'bg-white/20 text-white', playBtn: 'bg-white text-ink hover:bg-slate-100', saveBtn: 'bg-white/20 text-white hover:bg-white/30' },
  { bg: 'bg-brand-ochre', text: 'text-ink', textMuted: 'text-slate-800', badgeBg: 'bg-ink/10 text-ink', playBtn: 'bg-primary text-white hover:bg-body-strong', saveBtn: 'bg-ink/10 text-ink hover:bg-ink/20' },
  { bg: 'bg-brand-lavender', text: 'text-ink', textMuted: 'text-slate-700', badgeBg: 'bg-ink/10 text-ink', playBtn: 'bg-primary text-white hover:bg-body-strong', saveBtn: 'bg-ink/10 text-ink hover:bg-ink/20' },
];

export const JioSaavnSongCard: React.FC<JioSaavnSongCardProps> = ({ song, index, onSave }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(song.saved || false);

  const palette = SONG_CARD_PALETTES[index % SONG_CARD_PALETTES.length];

  const isCurrentActive = currentTrack?.downloadUrl === song.downloadUrl && song.downloadUrl;

  const handlePlay = () => {
    if (!song.downloadUrl) return;
    playTrack({
      id: song.id,
      title: song.name,
      artist: song.artistName,
      album: song.albumName,
      artworkUrl: song.artworkUrl,
      downloadUrl: song.downloadUrl,
    });
  };

  const handleSave = async () => {
    if (saved || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(song);
      setSaved(true);
    } catch (err) {
      console.error('Failed to save song:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return 'N/A';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`group relative ${palette.bg} rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between overflow-hidden`}>
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${palette.badgeBg}`}>
            {song.genre || 'Single'}
          </span>
          {song.year && (
            <span className={`text-xs font-mono font-medium ${palette.textMuted}`}>
              {song.year}
            </span>
          )}
        </div>

        {/* Artwork & Song Details */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-20 h-20 shrink-0 group/cover">
            <img
              src={song.artworkUrl || FALLBACK_ARTWORK}
              alt={song.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_ARTWORK;
              }}
              className="w-full h-full rounded-lg object-cover shadow-md border border-black/10 group-hover:scale-105 transition-transform"
            />
            {song.downloadUrl && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity"
                title="Play track"
              >
                <div className="w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
              </button>
            )}
          </div>

          <div className="overflow-hidden">
            <h3 className={`font-display font-medium text-lg leading-snug line-clamp-2 ${palette.text}`} title={song.name}>
              {song.name}
            </h3>
            <p className={`text-xs font-medium line-clamp-1 mt-1 ${palette.textMuted}`}>
              {song.artistName}
            </p>
            <p className={`text-[11px] opacity-80 line-clamp-1 mt-0.5 ${palette.textMuted}`}>
              {song.albumName}
            </p>
          </div>
        </div>

        {/* Track Duration Metrics */}
        <div className="flex items-center justify-between text-xs font-medium mb-5 p-3 rounded-lg bg-black/5">
          <div className={`flex items-center gap-1.5 ${palette.text}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDuration(song.duration)}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${palette.text}`}>
            <Music className="w-3.5 h-3.5" />
            <span>320kbps MP3</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex gap-2">
        {song.downloadUrl && (
          <button
            onClick={handlePlay}
            className={`flex-1 py-3 px-3 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              isCurrentActive && isPlaying ? 'bg-emerald-500 text-white' : palette.playBtn
            }`}
          >
            <Play className="w-4 h-4 ml-0.5" />
            {isCurrentActive && isPlaying ? 'Playing' : 'Play Live'}
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={saved || isSaving}
          className={`py-3 px-4 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
            saved ? 'bg-emerald-500/20 text-emerald-800 cursor-default' : palette.saveBtn
          }`}
          title={saved ? 'Saved' : 'Save Song to Personal Catalog'}
        >
          {saved ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              Saved
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
