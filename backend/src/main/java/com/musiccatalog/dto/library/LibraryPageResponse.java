package com.musiccatalog.dto.library;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryPageResponse {
    private List<AlbumResponse> content;
    private Integer page;
    private Integer limit;
    private Long totalElements;
    private Integer totalPages;
}
