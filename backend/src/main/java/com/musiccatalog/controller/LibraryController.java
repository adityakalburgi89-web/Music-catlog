package com.musiccatalog.controller;

import com.musiccatalog.dto.library.AlbumCreateRequest;
import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.dto.library.AlbumUpdateRequest;
import com.musiccatalog.dto.library.LibraryPageResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.LibraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
@Tag(name = "Library", description = "Personal album library management endpoints")
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping
    @Operation(summary = "Get user's personal saved album catalog")
    public ResponseEntity<LibraryPageResponse> getUserLibrary(
            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
            @RequestParam(name = "size", required = false, defaultValue = "12") int size,
            @RequestParam(name = "sort", required = false, defaultValue = "createdAt,desc") String sort,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        LibraryPageResponse response = libraryService.getUserLibrary(currentUser.getId(), page, size, sort);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific saved album details by ID")
    public ResponseEntity<AlbumResponse> getAlbumById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AlbumResponse response = libraryService.getAlbumById(currentUser.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Save an album to the personal library")
    public ResponseEntity<AlbumResponse> saveAlbum(
            @Valid @RequestBody AlbumCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AlbumResponse response = libraryService.saveAlbum(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update rating or notes on a saved album")
    public ResponseEntity<AlbumResponse> updateAlbum(
            @PathVariable Long id,
            @Valid @RequestBody AlbumUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AlbumResponse response = libraryService.updateAlbum(currentUser.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an album from personal library")
    public ResponseEntity<Void> deleteAlbum(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        libraryService.deleteAlbum(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
