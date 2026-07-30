package com.musiccatalog.service;

import com.musiccatalog.dto.analytics.AnalyticsResponse;
import com.musiccatalog.entity.SavedAlbum;
import com.musiccatalog.mapper.AlbumMapper;
import com.musiccatalog.repository.SavedAlbumRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private SavedAlbumRepository savedAlbumRepository;

    @Mock
    private AlbumMapper albumMapper;

    @InjectMocks
    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void getUserAnalytics_ReturnsCorrectMetrics() {
        Long userId = 1L;

        when(savedAlbumRepository.countByUserId(userId)).thenReturn(3L);
        when(savedAlbumRepository.sumTrackCountByUserId(userId)).thenReturn(33L);
        when(savedAlbumRepository.avgRatingByUserId(userId)).thenReturn(4.67);
        when(savedAlbumRepository.findGenreCountsByUserId(userId)).thenReturn(List.of(
                new Object[]{"Electronic", 2L},
                new Object[]{"Rock", 1L}
        ));
        when(savedAlbumRepository.findArtistCountsByUserId(userId)).thenReturn(List.of(
                new Object[]{"Daft Punk", 2L},
                new Object[]{"Pink Floyd", 1L}
        ));
        when(savedAlbumRepository.findRatingCountsByUserId(userId)).thenReturn(List.of(
                new Object[]{5, 2L},
                new Object[]{4, 1L}
        ));
        when(savedAlbumRepository.findReleaseDatesByUserId(userId)).thenReturn(List.of(
                LocalDate.of(2013, 5, 17),
                LocalDate.of(1973, 3, 1),
                LocalDate.of(2000, 10, 2)
        ));
        when(savedAlbumRepository.findByUserId(userId)).thenReturn(List.of(
                SavedAlbum.builder().trackCount(13).build(),
                SavedAlbum.builder().trackCount(10).build(),
                SavedAlbum.builder().trackCount(10).build()
        ));
        when(savedAlbumRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of());

        AnalyticsResponse analytics = analyticsService.getUserAnalytics(userId);

        assertNotNull(analytics);
        assertEquals(3L, analytics.getTotalAlbums());
        assertEquals(11.0, analytics.getAverageTrackCount());
        assertEquals(4.67, analytics.getAverageRating());
        assertEquals(2L, analytics.getAlbumsByGenre().get("Electronic"));
        assertEquals(1L, analytics.getAlbumsByArtist().get("Pink Floyd"));
        assertEquals(1L, analytics.getReleasesByYear().get(2013));
    }
}
