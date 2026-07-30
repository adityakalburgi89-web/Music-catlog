package com.musiccatalog.service;

import com.musiccatalog.dto.analytics.AnalyticsResponse;
import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.entity.SavedAlbum;
import com.musiccatalog.mapper.AlbumMapper;
import com.musiccatalog.repository.SavedAlbumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SavedAlbumRepository savedAlbumRepository;
    private final AlbumMapper albumMapper;

    @Transactional(readOnly = true)
    public AnalyticsResponse getUserAnalytics(Long userId) {
        Long totalAlbums = savedAlbumRepository.countByUserId(userId);
        Long totalTracks = savedAlbumRepository.sumTrackCountByUserId(userId);

        Double averageTrackCount = (totalAlbums > 0)
                ? Math.round(((double) totalTracks / totalAlbums) * 100.0) / 100.0
                : 0.0;

        Double rawAvgRating = savedAlbumRepository.avgRatingByUserId(userId);
        Double averageRating = (rawAvgRating != null)
                ? Math.round(rawAvgRating * 100.0) / 100.0
                : 0.0;

        // albumsByGenre
        Map<String, Long> albumsByGenre = new LinkedHashMap<>();
        for (Object[] row : savedAlbumRepository.findGenreCountsByUserId(userId)) {
            albumsByGenre.put((String) row[0], (Long) row[1]);
        }

        // albumsByArtist
        Map<String, Long> albumsByArtist = new LinkedHashMap<>();
        for (Object[] row : savedAlbumRepository.findArtistCountsByUserId(userId)) {
            albumsByArtist.put((String) row[0], (Long) row[1]);
        }

        // releasesByYear
        List<LocalDate> releaseDates = savedAlbumRepository.findReleaseDatesByUserId(userId);
        Map<Integer, Long> releasesByYear = new TreeMap<>();
        for (LocalDate date : releaseDates) {
            int year = date.getYear();
            releasesByYear.put(year, releasesByYear.getOrDefault(year, 0L) + 1);
        }

        // ratingDistribution (1-5)
        Map<Integer, Long> ratingDistribution = new LinkedHashMap<>();
        Map<Integer, Long> rawRatings = new HashMap<>();
        for (Object[] row : savedAlbumRepository.findRatingCountsByUserId(userId)) {
            if (row[0] != null) {
                rawRatings.put((Integer) row[0], (Long) row[1]);
            }
        }
        for (int r = 5; r >= 1; r--) {
            ratingDistribution.put(r, rawRatings.getOrDefault(r, 0L));
        }

        // trackCountDistribution
        List<SavedAlbum> allAlbums = savedAlbumRepository.findByUserId(userId);
        Map<String, Long> trackCountDistribution = new LinkedHashMap<>();
        trackCountDistribution.put("1-5 tracks", 0L);
        trackCountDistribution.put("6-10 tracks", 0L);
        trackCountDistribution.put("11-15 tracks", 0L);
        trackCountDistribution.put("16+ tracks", 0L);

        for (SavedAlbum album : allAlbums) {
            int tracks = album.getTrackCount() != null ? album.getTrackCount() : 0;
            if (tracks <= 5) {
                trackCountDistribution.put("1-5 tracks", trackCountDistribution.get("1-5 tracks") + 1);
            } else if (tracks <= 10) {
                trackCountDistribution.put("6-10 tracks", trackCountDistribution.get("6-10 tracks") + 1);
            } else if (tracks <= 15) {
                trackCountDistribution.put("11-15 tracks", trackCountDistribution.get("11-15 tracks") + 1);
            } else {
                trackCountDistribution.put("16+ tracks", trackCountDistribution.get("16+ tracks") + 1);
            }
        }

        // recentlyAddedAlbums
        List<AlbumResponse> recentlyAdded = savedAlbumRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(albumMapper::toResponse)
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .totalAlbums(totalAlbums)
                .averageRating(averageRating)
                .averageTrackCount(averageTrackCount)
                .albumsByGenre(albumsByGenre)
                .albumsByArtist(albumsByArtist)
                .releasesByYear(releasesByYear)
                .ratingDistribution(ratingDistribution)
                .trackCountDistribution(trackCountDistribution)
                .recentlyAddedAlbums(recentlyAdded)
                .build();
    }
}
