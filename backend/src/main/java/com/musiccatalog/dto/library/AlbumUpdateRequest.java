package com.musiccatalog.dto.library;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumUpdateRequest {

    @Min(value = 1, message = "User rating must be at least 1")
    @Max(value = 5, message = "User rating must be at most 5")
    private Integer userRating;

    @Size(max = 1000, message = "User notes cannot exceed 1000 characters")
    private String userNotes;
}
