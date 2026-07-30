package com.musiccatalog.service;

import com.musiccatalog.dto.analytics.*;
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

    @Transactional(readOnly = true)
    public AnalyticsResponse getUserAnalytics(Long userId) {
        Long totalSavedAlbums = savedAlbumRepository.countByUserId(userId);
        Long totalTracks = savedAlbumRepository.sumTrackCountByUserId(userId);

        Double averageTrackCount = (totalSavedAlbums > 0)
                ? (double) totalTracks / totalSavedAlbums
                : 0.0;

        Double rawAvgRating = savedAlbumRepository.avgRatingByUserId(userId);
        Double averageRating = (rawAvgRating != null)
                ? Math.round(rawAvgRating * 100.0) / 100.0
                : 0.0;

        // Genre distribution
        List<Object[]> rawGenres = savedAlbumRepository.findGenreDistributionByUserId(userId);
        List<GenreDistributionDto> genreDistribution = rawGenres.stream().map(row -> {
            String genre = (String) row[0];
            Long count = (Long) row[1];
            double percentage = (totalSavedAlbums > 0)
                    ? Math.round(((double) count / totalSavedAlbums * 100.0) * 100.0) / 100.0
                    : 0.0;
            return GenreDistributionDto.builder()
                    .genre(genre)
                    .count(count)
                    .percentage(percentage)
                    .build();
        }).collect(Collectors.toList());

        // Decade distribution
        List<LocalDate> releaseDates = savedAlbumRepository.findReleaseDatesByUserId(userId);
        Map<String, Long> decadeCounts = new TreeMap<>();
        for (LocalDate date : releaseDates) {
            int year = date.getYear();
            int decadeStart = (year / 10) * 10;
            String decadeLabel = decadeStart + "s";
            decadeCounts.put(decadeLabel, decadeCounts.getOrDefault(decadeLabel, 0L) + 1);
        }

        List<YearDistributionDto> releaseDecadeDistribution = decadeCounts.entrySet().stream()
                .map(entry -> YearDistributionDto.builder()
                        .decade(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        // Rating distribution (1 to 5)
        List<Object[]> rawRatings = savedAlbumRepository.findRatingDistributionByUserId(userId);
        Map<Integer, Long> ratingMap = new HashMap<>();
        for (Object[] row : rawRatings) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            if (rating != null) {
                ratingMap.put(rating, count);
            }
        }

        List<RatingDistributionDto> ratingDistribution = new ArrayList<>();
        for (int r = 5; r >= 1; r--) {
            ratingDistribution.add(RatingDistributionDto.builder()
                    .rating(r)
                    .count(ratingMap.getOrDefault(r, 0L))
                    .build());
        }

        // Top artists
        List<Object[]> rawArtists = savedAlbumRepository.findTopArtistsByUserId(userId);
        List<ArtistDistributionDto> topArtists = rawArtists.stream()
                .limit(5)
                .map(row -> ArtistDistributionDto.builder()
                        .artist((String) row[0])
                        .albumCount((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .totalSavedAlbums(totalSavedAlbums)
                .totalTracks(totalTracks)
                .averageTrackCount(Math.round(averageTrackCount * 10.0) / 10.0)
                .averageRating(averageRating)
                .genreDistribution(genreDistribution)
                .releaseDecadeDistribution(releaseDecadeDistribution)
                .ratingDistribution(ratingDistribution)
                .topArtists(topArtists)
                .build();
    }
}
