package com.musiccatalog.dto.jiosaavn;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class JioSaavnSongDto {

    private String id;
    private String name;
    private String albumName;
    private String artistName;
    private String genre;
    private String year;
    private String releaseDate;
    private Integer duration;
    private String artworkUrl;
    private String downloadUrl;
    private Boolean saved;
}
