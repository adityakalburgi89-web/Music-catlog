package com.musiccatalog.dto.itunes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AlbumSearchResponse {

    @JsonProperty("resultCount")
    private Integer resultCount;

    @JsonProperty("results")
    private List<AlbumSearchDto> results;

    private String query;
    private Integer totalResults;
    private List<AlbumSearchDto> albums;
}
