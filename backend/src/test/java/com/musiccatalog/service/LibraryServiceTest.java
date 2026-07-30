package com.musiccatalog.service;

import com.musiccatalog.dto.library.AlbumCreateRequest;
import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.dto.library.AlbumUpdateRequest;
import com.musiccatalog.entity.SavedAlbum;
import com.musiccatalog.entity.User;
import com.musiccatalog.exception.DuplicateResourceException;
import com.musiccatalog.exception.ResourceNotFoundException;
import com.musiccatalog.mapper.AlbumMapper;
import com.musiccatalog.repository.SavedAlbumRepository;
import com.musiccatalog.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LibraryServiceTest {

    @Mock
    private SavedAlbumRepository savedAlbumRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AlbumMapper albumMapper;

    @InjectMocks
    private LibraryService libraryService;

    private User testUser;
    private SavedAlbum savedAlbum;
    private AlbumCreateRequest createRequest;
    private AlbumResponse albumResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("user@example.com").name("Test User").build();

        savedAlbum = SavedAlbum.builder()
                .id(100L)
                .user(testUser)
                .appleCatalogId(617154241L)
                .title("Random Access Memories")
                .artistName("Daft Punk")
                .genre("Electronic")
                .releaseDate(LocalDate.of(2013, 5, 17))
                .trackCount(13)
                .collectionPrice(new BigDecimal("11.99"))
                .userRating(5)
                .userNotes("Masterpiece")
                .build();

        createRequest = AlbumCreateRequest.builder()
                .appleCatalogId(617154241L)
                .title("Random Access Memories")
                .artistName("Daft Punk")
                .genre("Electronic")
                .trackCount(13)
                .userRating(5)
                .userNotes("Masterpiece")
                .build();

        albumResponse = AlbumResponse.builder()
                .id(100L)
                .appleCatalogId(617154241L)
                .title("Random Access Memories")
                .artistName("Daft Punk")
                .genre("Electronic")
                .userRating(5)
                .build();
    }

    @Test
    void saveAlbum_Success() {
        when(savedAlbumRepository.existsByUserIdAndAppleCatalogId(1L, 617154241L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(savedAlbumRepository.save(any(SavedAlbum.class))).thenReturn(savedAlbum);
        when(albumMapper.toResponse(any(SavedAlbum.class))).thenReturn(albumResponse);

        AlbumResponse response = libraryService.saveAlbum(1L, createRequest);

        assertNotNull(response);
        assertEquals("Random Access Memories", response.getTitle());
        verify(savedAlbumRepository).save(any(SavedAlbum.class));
    }

    @Test
    void saveAlbum_Duplicate_ThrowsException() {
        when(savedAlbumRepository.existsByUserIdAndAppleCatalogId(1L, 617154241L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> libraryService.saveAlbum(1L, createRequest));
        verify(savedAlbumRepository, never()).save(any(SavedAlbum.class));
    }

    @Test
    void updateAlbum_Success() {
        AlbumUpdateRequest updateRequest = AlbumUpdateRequest.builder().userRating(4).userNotes("Updated note").build();

        when(savedAlbumRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(savedAlbum));
        when(savedAlbumRepository.save(any(SavedAlbum.class))).thenReturn(savedAlbum);
        when(albumMapper.toResponse(any(SavedAlbum.class))).thenReturn(albumResponse);

        AlbumResponse response = libraryService.updateAlbum(1L, 100L, updateRequest);

        assertNotNull(response);
        verify(savedAlbumRepository).save(savedAlbum);
    }

    @Test
    void deleteAlbum_Success() {
        when(savedAlbumRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(savedAlbum));

        assertDoesNotThrow(() -> libraryService.deleteAlbum(1L, 100L));
        verify(savedAlbumRepository).delete(savedAlbum);
    }

    @Test
    void deleteAlbum_NotFound_ThrowsException() {
        when(savedAlbumRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> libraryService.deleteAlbum(1L, 999L));
    }
}
