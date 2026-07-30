package com.musiccatalog.mapper;

import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.entity.SavedAlbum;
import org.springframework.stereotype.Component;

@Component
public class AlbumMapper {

    public AlbumResponse toResponse(SavedAlbum entity) {
        if (entity == null) return null;
        return AlbumResponse.builder()
                .id(entity.getId())
                .appleCatalogId(entity.getAppleCatalogId())
                .title(entity.getTitle())
                .artistName(entity.getArtistName())
                .genre(entity.getGenre())
                .releaseDate(entity.getReleaseDate())
                .trackCount(entity.getTrackCount())
                .artworkUrl(entity.getArtworkUrl())
                .collectionPrice(entity.getCollectionPrice())
                .userRating(entity.getUserRating())
                .userNotes(entity.getUserNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
