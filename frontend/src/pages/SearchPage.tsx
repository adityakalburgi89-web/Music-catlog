import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { libraryService } from '../services/libraryService';
import { ITunesAlbum, AlbumSearchResponse, JioSaavnSong, JioSaavnSearchResponse } from '../types';
import { AlbumSearchCard } from '../components/search/AlbumSearchCard';
import { JioSaavnSongCard } from '../components/search/JioSaavnSongCard';
import { JioSaavnPlaylistCard } from '../components/search/JioSaavnPlaylistCard';
import { SearchInputWithAI } from '../components/search/SearchInputWithAI';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, Music, Radio, Disc, ListMusic } from 'lucide-react';

type SearchTab = 'jiosaavn-songs' | 'jiosaavn-playlists' | 'itunes-albums';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('jiosaavn-songs');

  const [itunesData, setItunesData] = useState<AlbumSearchResponse | null>(null);
  const [jiosaavnSongsData, setJiosaavnSongsData] = useState<JioSaavnSearchResponse | null>(null);
  const [jiosaavnPlaylistsData, setJiosaavnPlaylistsData] = useState<JioSaavnSearchResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSearchResults = async (q: string, tab: SearchTab) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      if (tab === 'jiosaavn-songs') {
        const res = await searchService.searchJioSaavnSongs(q, 12);
        setJiosaavnSongsData(res);
      } else if (tab === 'jiosaavn-playlists') {
        const res = await searchService.searchJioSaavnPlaylists(q, 12);
        setJiosaavnPlaylistsData(res);
      } else {
        const res = await searchService.searchAlbums(q, 12);
        setItunesData(res);
      }
    } catch (err) {
      setError('Failed to fetch search results. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeQuery.trim()) {
      fetchSearchResults(activeQuery, activeTab);
    }
  }, [activeQuery, activeTab]);

  const handleExecuteSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery.trim());
    }
  };

  const handleSaveITunesAlbum = async (album: ITunesAlbum) => {
    await libraryService.saveAlbum({
      appleCatalogId: album.appleCatalogId,
      title: album.title,
      artistName: album.artistName,
      genre: album.genre || 'Uncategorized',
      releaseDate: album.releaseDate ? album.releaseDate.split('T')[0] : undefined,
      trackCount: album.trackCount || 0,
      collectionPrice: album.collectionPrice,
      artworkUrl: album.artworkUrl,
    });
  };

  const handleSaveJioSaavnSong = async (song: JioSaavnSong) => {
    const numericId = song.id ? Math.abs((longHash(song.id))) : Math.floor(Math.random() * 1000000);
    await libraryService.saveAlbum({
      appleCatalogId: numericId,
      title: song.name,
      artistName: song.artistName,
      genre: song.genre || 'Music',
      releaseDate: song.releaseDate ? song.releaseDate.split('T')[0] : undefined,
      trackCount: 1,
      collectionPrice: 0,
      artworkUrl: song.artworkUrl,
      downloadUrl: song.downloadUrl,
    });
  };

  const longHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Hero Header Band */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-hairline">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-peach/40 text-ink text-xs font-semibold mb-3 border border-brand-peach">
            <Radio className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
            JioSaavn & iTunes Live Search API
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink">
            Search songs & playlists
          </h1>
          <p className="mt-2 text-body text-base leading-relaxed">
            Search live tracks with direct 320kbps MP3 audio playback, explore curated playlists, or curate your iTunes album library.
          </p>
        </div>

        {/* Search Bar Input with AI Recommendations */}
        <SearchInputWithAI
          query={query}
          setQuery={setQuery}
          onSearch={handleExecuteSearch}
        />
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-hairline pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('jiosaavn-songs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            activeTab === 'jiosaavn-songs'
              ? 'bg-primary text-white'
              : 'bg-surface-soft hover:bg-canvas text-ink border border-hairline'
          }`}
        >
          <Music className="w-4 h-4" />
          JioSaavn Live Songs
        </button>

        <button
          onClick={() => setActiveTab('jiosaavn-playlists')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            activeTab === 'jiosaavn-playlists'
              ? 'bg-primary text-white'
              : 'bg-surface-soft hover:bg-canvas text-ink border border-hairline'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          JioSaavn Playlists
        </button>

        <button
          onClick={() => setActiveTab('itunes-albums')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            activeTab === 'itunes-albums'
              ? 'bg-primary text-white'
              : 'bg-surface-soft hover:bg-canvas text-ink border border-hairline'
          }`}
        >
          <Disc className="w-4 h-4" />
          iTunes Albums
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">
          {error}
        </div>
      )}

      {/* Loading & Grid Output */}
      {isLoading ? (
        <LoadingSpinner label={`Searching for "${activeQuery}"...`} />
      ) : !activeQuery.trim() ? (
        <div className="text-center py-16 bg-surface-soft rounded-xl border border-hairline p-8 max-w-md mx-auto my-6 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-brand-peach/30 text-ink flex items-center justify-center mx-auto mb-4 border border-brand-peach/50">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-display font-medium text-xl text-ink">Search ClayCatalog</h3>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            Enter an artist, song title, or playlist keyword in the search bar above to start searching.
          </p>
        </div>
      ) : (
        <>
          {/* Tab 1: JioSaavn Songs */}
          {activeTab === 'jiosaavn-songs' && (
            <>
              {jiosaavnSongsData && jiosaavnSongsData.songs && jiosaavnSongsData.songs.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Showing live songs for <strong className="text-ink">"{jiosaavnSongsData.query}"</strong></span>
                    <span>Found {jiosaavnSongsData.totalResults} tracks</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jiosaavnSongsData.songs.map((song, idx) => (
                      <JioSaavnSongCard
                        key={song.id || idx}
                        song={song}
                        index={idx}
                        onSave={handleSaveJioSaavnSong}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                jiosaavnSongsData && (
                  <div className="text-center py-20 bg-surface-soft rounded-xl border border-hairline p-8 max-w-md mx-auto">
                    <Music className="w-12 h-12 text-muted mx-auto mb-3" />
                    <h3 className="font-display font-medium text-lg text-ink">No Songs Found</h3>
                    <p className="text-xs text-muted mt-1">Try searching for famous tracks, singers, or movies.</p>
                  </div>
                )
              )}
            </>
          )}

          {/* Tab 2: JioSaavn Playlists */}
          {activeTab === 'jiosaavn-playlists' && (
            <>
              {jiosaavnPlaylistsData && jiosaavnPlaylistsData.playlists && jiosaavnPlaylistsData.playlists.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Showing playlists for <strong className="text-ink">"{jiosaavnPlaylistsData.query}"</strong></span>
                    <span>Found {jiosaavnPlaylistsData.totalResults} playlists</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {jiosaavnPlaylistsData.playlists.map((playlist, idx) => (
                      <JioSaavnPlaylistCard
                        key={playlist.id || idx}
                        playlist={playlist}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                jiosaavnPlaylistsData && (
                  <div className="text-center py-20 bg-surface-soft rounded-xl border border-hairline p-8 max-w-md mx-auto">
                    <ListMusic className="w-12 h-12 text-muted mx-auto mb-3" />
                    <h3 className="font-display font-medium text-lg text-ink">No Playlists Found</h3>
                    <p className="text-xs text-muted mt-1">Try searching for keywords like "Indie", "Bollywood", or "Party".</p>
                  </div>
                )
              )}
            </>
          )}

          {/* Tab 3: iTunes Albums */}
          {activeTab === 'itunes-albums' && (
            <>
              {itunesData && itunesData.albums && itunesData.albums.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Showing iTunes search results for <strong className="text-ink">"{itunesData.query}"</strong></span>
                    <span>Found {itunesData.totalResults} matching albums</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itunesData.albums.map((album, idx) => (
                      <AlbumSearchCard
                        key={album.appleCatalogId}
                        album={album}
                        index={idx}
                        onSave={handleSaveITunesAlbum}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                itunesData && (
                  <div className="text-center py-20 bg-surface-soft rounded-xl border border-hairline p-8 max-w-md mx-auto">
                    <Disc className="w-12 h-12 text-muted mx-auto mb-3" />
                    <h3 className="font-display font-medium text-lg text-ink">No Albums Found</h3>
                    <p className="text-xs text-muted mt-1">Try searching for famous artists or album titles.</p>
                  </div>
                )
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
