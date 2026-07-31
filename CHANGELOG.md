# Changelog

All notable changes to the Music Catalog application will be documented in this file.

## [1.2.0] - 2026-07-31

### Added
- **JioSaavn Live Songs & Playlists API Integration**: Real-time song and playlist search proxy returning $500 \times 500$ high-resolution artwork and direct $320\text{kbps}$ MP3 audio stream URLs.
- **Global `PlayerContext` & Interactive Turntable Streaming**: 1-click **Play** functionality across Search cards and personal Library grid items. Plays live audio directly on the interactive **Vinyl Turntable Deck**.
- **Flyway V3 DB Migration**: Added `download_url VARCHAR(1024)` column to `saved_albums` table for audio stream URL persistence.
- **Groq LLM AI Engine**: Custom music persona synthesis and sonic trend insights powered by Groq LLaMA 3.1 8B.

### Fixed
- Fixed iTunes Search `UnknownContentTypeException` by registering `text/javascript` media type in `MappingJackson2HttpMessageConverter`.
- Added browser `User-Agent` header to Spring `RestTemplate` bean to prevent CDN blocking.
- Fixed album cover artwork fallback by replacing defunct `via.placeholder.com` URLs with inline SVG vector placeholders and runtime `onError` handlers.
- Upgraded iTunes artwork resolution from `100x100` to `600x600bb`.
