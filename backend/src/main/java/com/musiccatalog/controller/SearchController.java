package com.musiccatalog.controller;

import com.musiccatalog.dto.itunes.AlbumSearchResponse;
import com.musiccatalog.dto.jiosaavn.JioSaavnSearchResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.ITunesSearchService;
import com.musiccatalog.service.JioSaavnSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Proxy music search for iTunes albums & JioSaavn live tracks/playlists")
public class SearchController {

    private final ITunesSearchService searchService;
    private final JioSaavnSearchService jioSaavnSearchService;

    @GetMapping
    @Operation(summary = "Search iTunes album catalog by keyword query")
    public ResponseEntity<AlbumSearchResponse> searchAlbums(
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "type", required = false, defaultValue = "album") String type,
            @RequestParam(name = "limit", required = false, defaultValue = "12") int limit,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser != null ? currentUser.getId() : null;
        AlbumSearchResponse response = searchService.searchAlbums(query, limit, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/jiosaavn/songs")
    @Operation(summary = "Search JioSaavn songs with direct high-quality MP3 audio stream links")
    public ResponseEntity<JioSaavnSearchResponse> searchJioSaavnSongs(
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "limit", required = false, defaultValue = "12") int limit,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser != null ? currentUser.getId() : null;
        JioSaavnSearchResponse response = jioSaavnSearchService.searchSongs(query, limit, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/jiosaavn/playlists")
    @Operation(summary = "Search JioSaavn playlists by query")
    public ResponseEntity<JioSaavnSearchResponse> searchJioSaavnPlaylists(
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "limit", required = false, defaultValue = "12") int limit) {

        JioSaavnSearchResponse response = jioSaavnSearchService.searchPlaylists(query, limit);
        return ResponseEntity.ok(response);
    }
}
