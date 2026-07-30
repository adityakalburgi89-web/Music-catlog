package com.musiccatalog.dto.itunes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AlbumSearchDto {

    @JsonProperty("collectionId")
    private Long appleCatalogId;

    @JsonProperty("collectionName")
    private String title;

    @JsonProperty("artistName")
    private String artistName;

    @JsonProperty("primaryGenreName")
    private String genre;

    @JsonProperty("releaseDate")
    private String releaseDate;

    @JsonProperty("trackCount")
    private Integer trackCount;

    @JsonProperty("artworkUrl100")
    private String artworkUrl;

    @JsonProperty("collectionPrice")
    private BigDecimal collectionPrice;

    private Boolean saved;
}
