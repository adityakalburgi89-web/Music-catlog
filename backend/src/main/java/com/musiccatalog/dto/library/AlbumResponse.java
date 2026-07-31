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
    private Long appleCatalogId;
    private String title;
    private String artistName;
    private String genre;
    private LocalDate releaseDate;
    private Integer trackCount;
    private String artworkUrl;
    private BigDecimal collectionPrice;
    private String downloadUrl;
    private Integer userRating;
    private String userNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
