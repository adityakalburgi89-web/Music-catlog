package com.musiccatalog.dto.analytics;

import com.musiccatalog.dto.library.AlbumResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Long totalAlbums;
    private Double averageRating;
    private Double averageTrackCount;
    private Map<String, Long> albumsByGenre;
    private Map<String, Long> albumsByArtist;
    private Map<Integer, Long> releasesByYear;
    private Map<Integer, Long> ratingDistribution;
    private Map<String, Long> trackCountDistribution;
    private List<AlbumResponse> recentlyAddedAlbums;
}
