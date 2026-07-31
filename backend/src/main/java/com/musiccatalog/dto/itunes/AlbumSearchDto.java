package com.musiccatalog.dto.itunes;

import com.fasterxml.jackson.annotation.JsonAlias;
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

    @JsonProperty("appleCatalogId")
    @JsonAlias({"collectionId", "appleCatalogId"})
    private Long appleCatalogId;

    @JsonProperty("title")
    @JsonAlias({"collectionName", "title"})
    private String title;

    @JsonProperty("artistName")
    @JsonAlias({"artistName", "artist"})
    private String artistName;

    @JsonProperty("genre")
    @JsonAlias({"primaryGenreName", "genre"})
    private String genre;

    @JsonProperty("releaseDate")
    @JsonAlias("releaseDate")
    private String releaseDate;

    @JsonProperty("trackCount")
    @JsonAlias("trackCount")
    private Integer trackCount;

    @JsonProperty("artworkUrl")
    @JsonAlias({"artworkUrl100", "artworkUrl600", "artworkUrl60", "artworkUrl"})
    private String artworkUrl;

    @JsonProperty("collectionPrice")
    @JsonAlias("collectionPrice")
    private BigDecimal collectionPrice;

    private Boolean saved;
}

