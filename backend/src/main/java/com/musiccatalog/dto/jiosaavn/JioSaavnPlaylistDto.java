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
public class JioSaavnPlaylistDto {

    private String id;
    private String name;
    private String artworkUrl;
    private Integer songCount;
    private String language;
    private String url;
}
