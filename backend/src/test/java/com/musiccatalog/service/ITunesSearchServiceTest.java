package com.musiccatalog.service;

import com.musiccatalog.config.RestClientConfig;
import com.musiccatalog.dto.itunes.AlbumSearchResponse;
import com.musiccatalog.repository.SavedAlbumRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(MockitoExtension.class)
class ITunesSearchServiceTest {

    @Mock
    private SavedAlbumRepository savedAlbumRepository;

    private RestTemplate restTemplate;
    private MockRestServiceServer mockServer;
    private ITunesSearchService iTunesSearchService;

    @BeforeEach
    void setUp() {
        RestClientConfig restClientConfig = new RestClientConfig();
        restTemplate = restClientConfig.restTemplate();
        mockServer = MockRestServiceServer.createServer(restTemplate);

        iTunesSearchService = new ITunesSearchService(restTemplate, savedAlbumRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(iTunesSearchService, "itunesBaseUrl", "https://itunes.apple.com");
    }

    @Test
    void searchAlbums_HandlesTextJavascriptContentTypeFromITunes() {
        String mockResponseJson = """
            {
              "resultCount": 1,
              "results": [
                {
                  "collectionId": 617154241,
                  "collectionName": "Random Access Memories",
                  "artistName": "Daft Punk",
                  "primaryGenreName": "Dance",
                  "releaseDate": "2013-05-17T07:00:00Z",
                  "trackCount": 13,
                  "artworkUrl100": "http://example.com/art.jpg",
                  "collectionPrice": 11.99
                }
              ]
            }
            """;

        mockServer.expect(requestTo("https://itunes.apple.com/search?term=Daft+Punk&entity=album&limit=10"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(mockResponseJson, MediaType.parseMediaType("text/javascript;charset=utf-8")));

        when(savedAlbumRepository.findByUserId(anyLong())).thenReturn(Collections.emptyList());

        AlbumSearchResponse response = iTunesSearchService.searchAlbums("Daft Punk", 10, 1L);

        mockServer.verify();
        assertNotNull(response);
        assertEquals("Daft Punk", response.getQuery());
        assertEquals(1, response.getResultCount());
        assertNotNull(response.getAlbums());
        assertEquals(1, response.getAlbums().size());

        var album = response.getAlbums().get(0);
        assertEquals(617154241L, album.getAppleCatalogId());
        assertEquals("Random Access Memories", album.getTitle());
        assertEquals("Daft Punk", album.getArtistName());
        assertFalse(album.getSaved());
    }
}
