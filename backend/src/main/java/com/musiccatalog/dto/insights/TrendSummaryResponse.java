package com.musiccatalog.dto.insights;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendSummaryResponse {
    private String musicPersona;
    private String summary;
    private String topDominantDecade;
    private List<String> keyObservations;
    private List<String> recommendedGenresToExplore;
    private LocalDateTime generatedAt;
}
