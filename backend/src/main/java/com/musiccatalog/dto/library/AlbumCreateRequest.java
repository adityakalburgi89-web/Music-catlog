package com.musiccatalog.dto.library;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumCreateRequest {

    @NotNull(message = "Apple catalog ID is required")
    private Long appleCatalogId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Artist name is required")
    private String artistName;

    @NotBlank(message = "Genre is required")
    private String genre;

    private LocalDate releaseDate;

    @NotNull(message = "Track count is required")
    private Integer trackCount;

    private String artworkUrl;
    private BigDecimal collectionPrice;
    private String downloadUrl;

    @Min(value = 1, message = "User rating must be between 1 and 5")
    @Max(value = 5, message = "User rating must be between 1 and 5")
    private Integer userRating;

    @Size(max = 1000, message = "User notes cannot exceed 1000 characters")
    private String userNotes;
}
