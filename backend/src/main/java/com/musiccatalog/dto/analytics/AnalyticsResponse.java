package com.musiccatalog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Long totalSavedAlbums;
    private Long totalTracks;
    private Double averageTrackCount;
    private Double averageRating;
    private List<GenreDistributionDto> genreDistribution;
    private List<YearDistributionDto> releaseDecadeDistribution;
    private List<RatingDistributionDto> ratingDistribution;
    private List<ArtistDistributionDto> topArtists;
}
