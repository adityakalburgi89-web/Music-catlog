package com.musiccatalog.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musiccatalog.dto.library.AlbumCreateRequest;
import com.musiccatalog.dto.library.AlbumResponse;
import com.musiccatalog.dto.library.LibraryPageResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.LibraryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class LibraryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LibraryService libraryService;

    @Test
    void getLibrary_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/library"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getLibrary_Authenticated_ReturnsOk() throws Exception {
        UserPrincipal principal = new UserPrincipal(1L, "user@example.com", "pass", "User", List.of());

        LibraryPageResponse mockResponse = LibraryPageResponse.builder()
                .content(List.of())
                .page(0)
                .size(12)
                .totalElements(0L)
                .totalPages(0)
                .last(true)
                .build();

        when(libraryService.getUserLibrary(eq(1L), anyInt(), anyInt(), anyString())).thenReturn(mockResponse);

        mockMvc.perform(get("/api/library")
                        .with(user(principal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void saveAlbum_Authenticated_ReturnsCreated() throws Exception {
        UserPrincipal principal = new UserPrincipal(1L, "user@example.com", "pass", "User", List.of());

        AlbumCreateRequest createRequest = AlbumCreateRequest.builder()
                .appleCatalogId(617154241L)
                .title("Random Access Memories")
                .artistName("Daft Punk")
                .genre("Electronic")
                .trackCount(13)
                .userRating(5)
                .build();

        AlbumResponse mockResponse = AlbumResponse.builder()
                .id(1L)
                .appleCatalogId(617154241L)
                .title("Random Access Memories")
                .artistName("Daft Punk")
                .genre("Electronic")
                .userRating(5)
                .build();

        when(libraryService.saveAlbum(eq(1L), any(AlbumCreateRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/library")
                        .with(user(principal))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Random Access Memories"));
    }
}
