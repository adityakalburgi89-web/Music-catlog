package com.musiccatalog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenreDistributionDto {
    private String genre;
    private Long count;
    private Double percentage;
}
