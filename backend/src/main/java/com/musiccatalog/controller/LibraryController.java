package com.musiccatalog.controller;

import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.dto.library.AlbumSaveRequest;
import com.musiccatalog.dto.library.AlbumUpdateRequest;
import com.musiccatalog.dto.library.LibraryPageResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.LibraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping
    public ResponseEntity<LibraryPageResponse> getUserLibrary(
            @RequestParam(name = "genre", required = false) String genre,
            @RequestParam(name = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "order", required = false, defaultValue = "desc") String order,
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "limit", required = false, defaultValue = "12") int limit,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        LibraryPageResponse response = libraryService.getUserLibrary(currentUser.getId(), genre, sortBy, order, page, limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlbumResponse> getAlbumById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AlbumResponse response = libraryService.getAlbumById(currentUser.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<AlbumResponse> saveAlbum(
            @Valid @RequestBody AlbumSaveRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AlbumResponse response = libraryService.saveAlbum(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlbumResponse> updateAlbum(
            @PathVariable Long id,
            @Valid @RequestBody AlbumUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AlbumResponse response = libraryService.updateAlbum(currentUser.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        libraryService.deleteAlbum(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
