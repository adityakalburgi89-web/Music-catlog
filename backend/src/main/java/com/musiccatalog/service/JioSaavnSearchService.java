package com.musiccatalog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musiccatalog.dto.jiosaavn.JioSaavnPlaylistDto;
import com.musiccatalog.dto.jiosaavn.JioSaavnSearchResponse;
import com.musiccatalog.dto.jiosaavn.JioSaavnSongDto;
import com.musiccatalog.repository.SavedAlbumRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class JioSaavnSearchService {

    private final RestTemplate restTemplate;
    private final SavedAlbumRepository savedAlbumRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.jiosaavn.base-url:https://saavn.sumit.co}")
    private String jiosaavnBaseUrl;

    @Cacheable(value = "jiosaavnSongsCache", key = "#query + '-' + #limit + '-' + (#userId != null ? #userId : 0)")
    public JioSaavnSearchResponse searchSongs(String query, int limit, Long userId) {
        if (query == null || query.trim().isEmpty()) {
            return JioSaavnSearchResponse.builder()
                    .query(query)
                    .totalResults(0)
                    .resultCount(0)
                    .songs(Collections.emptyList())
                    .build();
        }

        try {
            String encodedQuery = URLEncoder.encode(query.trim(), StandardCharsets.UTF_8);
            String url = String.format("%s/api/search/songs?query=%s&limit=%d", jiosaavnBaseUrl, encodedQuery, Math.max(limit, 10));

            String rawJson = restTemplate.getForObject(url, String.class);
            if (rawJson == null) {
                return emptyResponse(query);
            }

            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode resultsNode = root.path("data").path("results");

            List<JioSaavnSongDto> songs = new ArrayList<>();
            if (resultsNode.isArray()) {
                for (JsonNode songNode : resultsNode) {
                    JioSaavnSongDto song = parseSongNode(songNode);
                    if (song != null) {
                        songs.add(song);
                    }
                }
            }

            // Decorate with saved status
            Set<Long> savedCatalogIds = new HashSet<>();
            if (userId != null && !songs.isEmpty()) {
                savedAlbumRepository.findByUserId(userId)
                        .forEach(saved -> savedCatalogIds.add(saved.getAppleCatalogId()));
            }

            songs.forEach(song -> {
                Long numericId = parseNumericId(song.getId());
                song.setSaved(numericId != null && savedCatalogIds.contains(numericId));
            });

            return JioSaavnSearchResponse.builder()
                    .query(query)
                    .totalResults(songs.size())
                    .resultCount(songs.size())
                    .songs(songs)
                    .build();

        } catch (Exception ex) {
            log.error("Error querying JioSaavn Songs API: {}", ex.getMessage(), ex);
            return emptyResponse(query);
        }
    }

    @Cacheable(value = "jiosaavnPlaylistsCache", key = "#query + '-' + #limit")
    public JioSaavnSearchResponse searchPlaylists(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return JioSaavnSearchResponse.builder()
                    .query(query)
                    .totalResults(0)
                    .resultCount(0)
                    .playlists(Collections.emptyList())
                    .build();
        }

        try {
            String encodedQuery = URLEncoder.encode(query.trim(), StandardCharsets.UTF_8);
            String url = String.format("%s/api/search/playlists?query=%s&limit=%d", jiosaavnBaseUrl, encodedQuery, Math.max(limit, 10));

            String rawJson = restTemplate.getForObject(url, String.class);
            if (rawJson == null) {
                return JioSaavnSearchResponse.builder()
                        .query(query)
                        .totalResults(0)
                        .resultCount(0)
                        .playlists(Collections.emptyList())
                        .build();
            }

            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode resultsNode = root.path("data").path("results");

            List<JioSaavnPlaylistDto> playlists = new ArrayList<>();
            if (resultsNode.isArray()) {
                for (JsonNode node : resultsNode) {
                    JioSaavnPlaylistDto playlist = parsePlaylistNode(node);
                    if (playlist != null) {
                        playlists.add(playlist);
                    }
                }
            }

            return JioSaavnSearchResponse.builder()
                    .query(query)
                    .totalResults(playlists.size())
                    .resultCount(playlists.size())
                    .playlists(playlists)
                    .build();

        } catch (Exception ex) {
            log.error("Error querying JioSaavn Playlists API: {}", ex.getMessage(), ex);
            return JioSaavnSearchResponse.builder()
                    .query(query)
                    .totalResults(0)
                    .resultCount(0)
                    .playlists(Collections.emptyList())
                    .build();
        }
    }

    private JioSaavnSongDto parseSongNode(JsonNode node) {
        try {
            String id = node.path("id").asText(UUID.randomUUID().toString());
            String name = node.path("name").asText("Unknown Track");

            String albumName = node.path("album").path("name").asText("");
            if (albumName.isEmpty()) {
                albumName = node.path("album").asText("Single");
            }

            String artistName = extractArtistName(node);
            String year = node.path("year").asText("");
            String releaseDate = node.path("releaseDate").asText("");
            String language = node.path("language").asText("Music");
            Integer duration = node.path("duration").isNumber() ? node.path("duration").asInt() : 180;

            String artworkUrl = extractBestImage(node.path("image"));
            String downloadUrl = extractBestAudioUrl(node.path("downloadUrl"));

            return JioSaavnSongDto.builder()
                    .id(id)
                    .name(name)
                    .albumName(albumName)
                    .artistName(artistName)
                    .genre(capitalize(language))
                    .year(year)
                    .releaseDate(releaseDate)
                    .duration(duration)
                    .artworkUrl(artworkUrl)
                    .downloadUrl(downloadUrl)
                    .saved(false)
                    .build();
        } catch (Exception e) {
            log.warn("Failed to parse JioSaavn song node: {}", e.getMessage());
            return null;
        }
    }

    private JioSaavnPlaylistDto parsePlaylistNode(JsonNode node) {
        try {
            String id = node.path("id").asText(UUID.randomUUID().toString());
            String name = node.path("name").asText("JioSaavn Playlist");
            String artworkUrl = extractBestImage(node.path("image"));
            Integer songCount = node.path("songCount").isInt() ? node.path("songCount").asInt() : 0;
            String language = node.path("language").asText("All");
            String url = node.path("url").asText("");

            return JioSaavnPlaylistDto.builder()
                    .id(id)
                    .name(name)
                    .artworkUrl(artworkUrl)
                    .songCount(songCount)
                    .language(capitalize(language))
                    .url(url)
                    .build();
        } catch (Exception e) {
            log.warn("Failed to parse JioSaavn playlist node: {}", e.getMessage());
            return null;
        }
    }

    private String extractArtistName(JsonNode songNode) {
        JsonNode primaryArtists = songNode.path("artists").path("primary");
        if (primaryArtists.isArray() && primaryArtists.size() > 0) {
            List<String> names = new ArrayList<>();
            for (JsonNode artist : primaryArtists) {
                String n = artist.path("name").asText();
                if (!n.isEmpty()) names.add(n);
            }
            if (!names.isEmpty()) return String.join(", ", names);
        }

        String primaryStr = songNode.path("primaryArtists").asText("");
        if (!primaryStr.isEmpty()) return primaryStr;

        String singers = songNode.path("singers").asText("");
        if (!singers.isEmpty()) return singers;

        return "Various Artists";
    }

    private String extractBestImage(JsonNode imageNode) {
        if (imageNode.isArray() && imageNode.size() > 0) {
            // Get last item (highest resolution, e.g. 500x500)
            JsonNode best = imageNode.get(imageNode.size() - 1);
            return best.path("url").asText("");
        }
        return imageNode.asText("");
    }

    private String extractBestAudioUrl(JsonNode downloadNode) {
        if (downloadNode.isArray() && downloadNode.size() > 0) {
            // Priority: 320kbps -> 160kbps -> last available
            for (JsonNode link : downloadNode) {
                if ("320kbps".equalsIgnoreCase(link.path("quality").asText())) {
                    return link.path("url").asText("");
                }
            }
            for (JsonNode link : downloadNode) {
                if ("160kbps".equalsIgnoreCase(link.path("quality").asText())) {
                    return link.path("url").asText("");
                }
            }
            JsonNode best = downloadNode.get(downloadNode.size() - 1);
            return best.path("url").asText("");
        }
        return "";
    }

    private Long parseNumericId(String idStr) {
        if (idStr == null) return null;
        try {
            return Long.parseLong(idStr.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return Math.abs((long) idStr.hashCode());
        }
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "Music";
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    private JioSaavnSearchResponse emptyResponse(String query) {
        return JioSaavnSearchResponse.builder()
                .query(query)
                .totalResults(0)
                .resultCount(0)
                .songs(Collections.emptyList())
                .build();
    }
}
