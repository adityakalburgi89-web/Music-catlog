package com.musiccatalog.service;

import com.musiccatalog.dto.library.AlbumCreateRequest;
import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.dto.library.AlbumUpdateRequest;
import com.musiccatalog.dto.library.LibraryPageResponse;
import com.musiccatalog.entity.SavedAlbum;
import com.musiccatalog.entity.User;
import com.musiccatalog.exception.DuplicateResourceException;
import com.musiccatalog.exception.ResourceNotFoundException;
import com.musiccatalog.mapper.AlbumMapper;
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
    private final AlbumMapper albumMapper;

    @Transactional
    public AlbumResponse saveAlbum(Long userId, AlbumCreateRequest request) {
        if (savedAlbumRepository.existsByUserIdAndAppleCatalogId(userId, request.getAppleCatalogId())) {
            throw new DuplicateResourceException("Album with Apple Catalog ID " + request.getAppleCatalogId() + " is already saved in your library");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        SavedAlbum savedAlbum = SavedAlbum.builder()
                .user(user)
                .appleCatalogId(request.getAppleCatalogId())
                .title(request.getTitle())
                .artistName(request.getArtistName())
                .genre(request.getGenre())
                .releaseDate(request.getReleaseDate())
                .trackCount(request.getTrackCount())
                .artworkUrl(request.getArtworkUrl())
                .collectionPrice(request.getCollectionPrice())
                .downloadUrl(request.getDownloadUrl())
                .userRating(request.getUserRating())
                .userNotes(request.getUserNotes())
                .build();

        SavedAlbum saved = savedAlbumRepository.save(savedAlbum);
        return albumMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public LibraryPageResponse getUserLibrary(Long userId, int page, int size, String sort) {
        String[] sortParts = sort.split(",");
        String property = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1]))
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));
        Page<SavedAlbum> albumPage = savedAlbumRepository.findByUserId(userId, pageable);

        List<AlbumResponse> responses = albumPage.getContent().stream()
                .map(albumMapper::toResponse)
                .toList();

        return LibraryPageResponse.builder()
                .content(responses)
                .page(page)
                .size(size)
                .totalElements(albumPage.getTotalElements())
                .totalPages(albumPage.getTotalPages())
                .last(albumPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public AlbumResponse getAlbumById(Long userId, Long albumId) {
        SavedAlbum savedAlbum = savedAlbumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved album not found with id: " + albumId));
        return albumMapper.toResponse(savedAlbum);
    }

    @Transactional
    public AlbumResponse updateAlbum(Long userId, Long albumId, AlbumUpdateRequest request) {
        SavedAlbum savedAlbum = savedAlbumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved album not found with id: " + albumId));

        if (request.getUserRating() != null) {
            savedAlbum.setUserRating(request.getUserRating());
        }
        if (request.getUserNotes() != null) {
            savedAlbum.setUserNotes(request.getUserNotes());
        }

        SavedAlbum updated = savedAlbumRepository.save(savedAlbum);
        return albumMapper.toResponse(updated);
    }

    @Transactional
    public void deleteAlbum(Long userId, Long albumId) {
        SavedAlbum savedAlbum = savedAlbumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved album not found with id: " + albumId));
        savedAlbumRepository.delete(savedAlbum);
    }
}
