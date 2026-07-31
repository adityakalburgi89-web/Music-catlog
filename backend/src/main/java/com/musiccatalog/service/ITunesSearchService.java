package com.musiccatalog.service;

import com.musiccatalog.dto.itunes.AlbumSearchDto;
import com.musiccatalog.dto.itunes.AlbumSearchResponse;
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
public class ITunesSearchService {

    private final RestTemplate restTemplate;
    private final SavedAlbumRepository savedAlbumRepository;

    @Value("${app.itunes.base-url:https://itunes.apple.com}")
    private String itunesBaseUrl;

    @Cacheable(value = "itunesSearchCache", key = "#query + '-' + #limit + '-' + (#userId != null ? #userId : 0)")
    public AlbumSearchResponse searchAlbums(String query, int limit, Long userId) {
        if (query == null || query.trim().isEmpty()) {
            return AlbumSearchResponse.builder()
                    .query(query)
                    .totalResults(0)
                    .resultCount(0)
                    .albums(Collections.emptyList())
                    .build();
        }

        try {
            String encodedQuery = URLEncoder.encode(query.trim(), StandardCharsets.UTF_8);
            String url = String.format("%s/search?term=%s&entity=album&limit=%d", itunesBaseUrl, encodedQuery, Math.max(limit, 10));

            AlbumSearchResponse response = restTemplate.getForObject(url, AlbumSearchResponse.class);

            List<AlbumSearchDto> rawAlbums = (response != null && response.getResults() != null)
                    ? response.getResults()
                    : Collections.emptyList();

            // Decorate with saved in library status for current user
            Set<Long> savedCatalogIds = new HashSet<>();
            if (userId != null && !rawAlbums.isEmpty()) {
                savedAlbumRepository.findByUserId(userId)
                        .forEach(saved -> savedCatalogIds.add(saved.getAppleCatalogId()));
            }

            rawAlbums.forEach(album -> {
                if (album.getArtworkUrl() != null) {
                    album.setArtworkUrl(album.getArtworkUrl().replaceAll("/\\d+x\\d+bb\\.", "/600x600bb."));
                }
                album.setSaved(
                    album.getAppleCatalogId() != null && savedCatalogIds.contains(album.getAppleCatalogId())
                );
            });

            return AlbumSearchResponse.builder()
                    .query(query)
                    .totalResults(rawAlbums.size())
                    .resultCount(rawAlbums.size())
                    .albums(rawAlbums)
                    .build();

        } catch (Exception ex) {
            log.error("Error querying iTunes Search API: {}", ex.getMessage(), ex);
            return AlbumSearchResponse.builder()
                    .query(query)
                    .totalResults(0)
                    .resultCount(0)
                    .albums(Collections.emptyList())
                    .build();
        }
    }
}
