package com.musiccatalog.service;

import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.dto.library.AlbumSaveRequest;
import com.musiccatalog.dto.library.AlbumUpdateRequest;
import com.musiccatalog.dto.library.LibraryPageResponse;
import com.musiccatalog.entity.SavedAlbum;
import com.musiccatalog.entity.User;
import com.musiccatalog.exception.DuplicateResourceException;
import com.musiccatalog.exception.ResourceNotFoundException;
import com.musiccatalog.repository.SavedAlbumRepository;
import com.musiccatalog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final SavedAlbumRepository savedAlbumRepository;
    private final UserRepository userRepository;

    @Transactional
    public AlbumResponse saveAlbum(Long userId, AlbumSaveRequest request) {
        if (savedAlbumRepository.existsByUserIdAndItunesCollectionId(userId, request.getItunesCollectionId())) {
            throw new DuplicateResourceException("Album with iTunes Collection ID " + request.getItunesCollectionId() + " is already in your library");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SavedAlbum savedAlbum = SavedAlbum.builder()
                .user(user)
                .itunesCollectionId(request.getItunesCollectionId())
                .title(request.getTitle())
                .artist(request.getArtist())
                .genre(request.getGenre())
                .releaseDate(request.getReleaseDate())
                .trackCount(request.getTrackCount())
                .price(request.getPrice())
                .artworkUrl(request.getArtworkUrl())
                .rating(request.getRating())
                .notes(request.getNotes())
                .build();

        SavedAlbum saved = savedAlbumRepository.save(savedAlbum);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public LibraryPageResponse getUserLibrary(Long userId, String genre, String sortBy, String order, int page, int limit) {
        Sort.Direction direction = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        
        String sortProperty = "createdAt";
        if ("rating".equalsIgnoreCase(sortBy)) sortProperty = "rating";
        else if ("title".equalsIgnoreCase(sortBy)) sortProperty = "title";
        else if ("artist".equalsIgnoreCase(sortBy)) sortProperty = "artist";
        else if ("releaseDate".equalsIgnoreCase(sortBy)) sortProperty = "releaseDate";

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, sortProperty));

        Page<SavedAlbum> albumPage;
        if (genre != null && !genre.trim().isEmpty()) {
            albumPage = savedAlbumRepository.findByUserIdAndGenre(userId, genre.trim(), pageable);
        } else {
            albumPage = savedAlbumRepository.findByUserId(userId, pageable);
        }

        List<AlbumResponse> responses = albumPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return LibraryPageResponse.builder()
                .content(responses)
                .page(page)
                .limit(limit)
                .totalElements(albumPage.getTotalElements())
                .totalPages(albumPage.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public AlbumResponse getAlbumById(Long userId, Long albumId) {
        SavedAlbum savedAlbum = savedAlbumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved album not found with id: " + albumId));
        return mapToResponse(savedAlbum);
    }

    @Transactional
    public AlbumResponse updateAlbum(Long userId, Long albumId, AlbumUpdateRequest request) {
        SavedAlbum savedAlbum = savedAlbumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved album not found with id: " + albumId));

        if (request.getRating() != null) {
            savedAlbum.setRating(request.getRating());
        }
        if (request.getNotes() != null) {
            savedAlbum.setNotes(request.getNotes());
        }

        SavedAlbum updated = savedAlbumRepository.save(savedAlbum);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAlbum(Long userId, Long albumId) {
        SavedAlbum savedAlbum = savedAlbumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved album not found with id: " + albumId));
        savedAlbumRepository.delete(savedAlbum);
    }

    private AlbumResponse mapToResponse(SavedAlbum album) {
        return AlbumResponse.builder()
                .id(album.getId())
                .itunesCollectionId(album.getItunesCollectionId())
                .title(album.getTitle())
                .artist(album.getArtist())
                .genre(album.getGenre())
                .releaseDate(album.getReleaseDate())
                .trackCount(album.getTrackCount())
                .price(album.getPrice())
                .artworkUrl(album.getArtworkUrl())
                .rating(album.getRating())
                .notes(album.getNotes())
                .createdAt(album.getCreatedAt())
                .updatedAt(album.getUpdatedAt())
                .build();
    }
}
