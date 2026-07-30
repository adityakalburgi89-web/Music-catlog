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
public class ITunesAlbumDto {

    @JsonProperty("collectionId")
    private Long itunesCollectionId;

    @JsonProperty("collectionName")
    private String title;

    @JsonProperty("artistName")
    private String artist;

    @JsonProperty("primaryGenreName")
    private String genre;

    @JsonProperty("releaseDate")
    private String releaseDate; // ISO format from iTunes

    @JsonProperty("trackCount")
    private Integer trackCount;

    @JsonProperty("collectionPrice")
    private BigDecimal price;

    @JsonProperty("artworkUrl100")
    private String artworkUrl;

    @JsonProperty("country")
    private String country;

    private Boolean isSavedInLibrary;
}
