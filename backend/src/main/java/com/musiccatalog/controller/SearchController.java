package com.musiccatalog.controller;

import com.musiccatalog.dto.itunes.ITunesSearchResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.ITunesSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ITunesSearchService searchService;

    @GetMapping
    public ResponseEntity<ITunesSearchResponse> searchAlbums(
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "type", required = false, defaultValue = "album") String type,
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "limit", required = false, defaultValue = "12") int limit,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser != null ? currentUser.getId() : null;
        ITunesSearchResponse response = searchService.searchAlbums(query, page, limit, userId);
        return ResponseEntity.ok(response);
    }
}
