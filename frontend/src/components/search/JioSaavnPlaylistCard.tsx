import React from 'react';
import { JioSaavnPlaylist } from '../../types';
import { ListMusic, ExternalLink, Globe } from 'lucide-react';

interface JioSaavnPlaylistCardProps {
  playlist: JioSaavnPlaylist;
  index: number;
}

const FALLBACK_ARTWORK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='300' height='300' fill='%23242433'/><circle cx='150' cy='150' r='100' fill='%2312121a' stroke='%23333348' stroke-width='4'/><circle cx='150' cy='150' r='35' fill='%23e85d04'/><circle cx='150' cy='150' r='10' fill='%2312121a'/></svg>";

export const JioSaavnPlaylistCard: React.FC<JioSaavnPlaylistCardProps> = ({ playlist }) => {
  return (
    <div className="group relative bg-surface-card border border-hairline rounded-xl p-5 hover:border-ink/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-surface-strong">
          <img
            src={playlist.artworkUrl || FALLBACK_ARTWORK}
            alt={playlist.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_ARTWORK;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-canvas/90 text-ink border border-hairline backdrop-blur-sm flex items-center gap-1">
            <Globe className="w-3 h-3 text-brand-pink" />
            <span>{playlist.language || 'Music'}</span>
          </span>

          {playlist.songCount !== undefined && playlist.songCount > 0 && (
            <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white flex items-center gap-1 shadow-sm">
              <ListMusic className="w-3 h-3" />
              <span>{playlist.songCount} Tracks</span>
            </span>
          )}
        </div>

        <h3 className="font-display font-medium text-base text-ink line-clamp-2 group-hover:text-brand-pink transition-colors mb-1" title={playlist.name}>
          {playlist.name}
        </h3>
      </div>

      {playlist.url && (
        <a
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full py-2.5 px-3 rounded-md bg-canvas hover:bg-surface-soft text-ink border border-hairline text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Playlist
        </a>
      )}
    </div>
  );
};
