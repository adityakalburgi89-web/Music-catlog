package com.musiccatalog.service;

import com.musiccatalog.dto.itunes.ITunesAlbumDto;
import com.musiccatalog.dto.itunes.ITunesSearchResponse;
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

    public ITunesSearchResponse searchAlbums(String query, int page, int limit, Long userId) {
        if (query == null || query.trim().isEmpty()) {
            return ITunesSearchResponse.builder()
                    .query(query)
                    .page(page)
                    .limit(limit)
                    .totalResults(0)
                    .resultCount(0)
                    .albums(Collections.emptyList())
                    .build();
        }

        try {
            String encodedQuery = URLEncoder.encode(query.trim(), StandardCharsets.UTF_8);
            String url = String.format("%s/search?term=%s&entity=album&limit=200", itunesBaseUrl, encodedQuery);

            ITunesSearchResponse response = restTemplate.getForObject(url, ITunesSearchResponse.class);

            List<ITunesAlbumDto> allAlbums = (response != null && response.getResults() != null)
                    ? response.getResults()
                    : Collections.emptyList();

            // Decorate with saved in library status
            Set<Long> savedItunesIds = new HashSet<>();
            if (userId != null && !allAlbums.isEmpty()) {
                savedAlbumRepository.findByUserId(userId).forEach(saved -> savedItunesIds.add(saved.getItunesCollectionId()));
            }

            allAlbums.forEach(album -> album.setIsSavedInLibrary(
                    album.getItunesCollectionId() != null && savedItunesIds.contains(album.getItunesCollectionId())
            ));

            // Paginate local results
            int totalResults = allAlbums.size();
            int fromIndex = Math.min((page - 1) * limit, totalResults);
            int toIndex = Math.min(fromIndex + limit, totalResults);
            List<ITunesAlbumDto> paginatedAlbums = (fromIndex < totalResults)
                    ? allAlbums.subList(fromIndex, toIndex)
                    : Collections.emptyList();

            return ITunesSearchResponse.builder()
                    .query(query)
                    .page(page)
                    .limit(limit)
                    .totalResults(totalResults)
                    .resultCount(paginatedAlbums.size())
                    .albums(paginatedAlbums)
                    .build();

        } catch (Exception ex) {
            log.error("Failed to query iTunes Search API: {}", ex.getMessage(), ex);
            return ITunesSearchResponse.builder()
                    .query(query)
                    .page(page)
                    .limit(limit)
                    .totalResults(0)
                    .resultCount(0)
                    .albums(Collections.emptyList())
                    .build();
        }
    }
}
