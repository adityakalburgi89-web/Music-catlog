package com.musiccatalog.dto.library;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AlbumSaveRequest {

    @NotNull(message = "iTunes Collection ID is required")
    private Long itunesCollectionId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Artist is required")
    private String artist;

    @NotBlank(message = "Genre is required")
    private String genre;

    private LocalDate releaseDate;

    @NotNull(message = "Track count is required")
    private Integer trackCount;

    private BigDecimal price;
    private String artworkUrl;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    private String notes;
}
