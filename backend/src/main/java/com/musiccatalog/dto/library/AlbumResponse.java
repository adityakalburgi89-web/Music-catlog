package com.musiccatalog.dto.library;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumResponse {
    private Long id;
    private Long itunesCollectionId;
    private String title;
    private String artist;
    private String genre;
    private LocalDate releaseDate;
    private Integer trackCount;
    private BigDecimal price;
    private String artworkUrl;
    private Integer rating;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
