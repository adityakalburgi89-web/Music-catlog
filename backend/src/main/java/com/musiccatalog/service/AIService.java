package com.musiccatalog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musiccatalog.dto.analytics.AnalyticsResponse;
import com.musiccatalog.dto.insights.TrendSummaryRequest;
import com.musiccatalog.dto.insights.TrendSummaryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    private final AnalyticsService analyticsService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.openai.api-key:your_groq_api_key_here}")
    private String apiKey;

    @Value("${app.openai.model:llama-3.1-8b-instant}")
    private String model;

    public TrendSummaryResponse generateTrendSummary(Long userId, TrendSummaryRequest request) {
        AnalyticsResponse analytics = analyticsService.getUserAnalytics(userId);

        if (analytics.getTotalAlbums() == 0) {
            return TrendSummaryResponse.builder()
                    .musicPersona("Emerging Music Enthusiast")
                    .summary(
                            "Your personal music catalog is currently empty. Start searching and saving your favorite albums from the iTunes Search page to unlock AI-powered insights and trend analytics!")
                    .topDominantDecade("N/A")
                    .keyObservations(List.of(
                            "No albums stored in personal library.",
                            "Add at least 3-5 albums with ratings to generate deep sonic insights."))
                    .recommendedGenresToExplore(List.of("Alternative", "Electronic", "Classic Rock", "Jazz", "Hip-Hop"))
                    .generatedAt(LocalDateTime.now())
                    .build();
        }

        // Attempt Groq LLM API Call
        try {
            if (apiKey != null && !apiKey.trim().isEmpty()) {
                TrendSummaryResponse aiResponse = callGroqLLM(analytics, request);
                if (aiResponse != null) {
                    return aiResponse;
                }
            }
        } catch (Exception ex) {
            log.warn("Groq API call failed or timed out. Falling back to local smart synthesis engine: {}",
                    ex.getMessage());
        }

        // Fallback Local Smart Synthesis Engine
        return generateLocalFallbackSummary(analytics, request);
    }

    private TrendSummaryResponse callGroqLLM(AnalyticsResponse analytics, TrendSummaryRequest request)
            throws Exception {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        String topGenre = analytics.getAlbumsByGenre().isEmpty()
                ? "Eclectic"
                : analytics.getAlbumsByGenre().keySet().iterator().next();

        String topDecade = analytics.getReleasesByYear().isEmpty()
                ? "Modern"
                : analytics.getReleasesByYear().keySet().iterator().next() + "s";

        String promptText = String.format("""
                Analyze this music user catalog metrics and generate a JSON response strictly in this exact format:
                {
                  "musicPersona": "Short 3-5 word creative music persona title",
                  "summary": "2-3 sentence overview of their listening habits based on saved albums",
                  "topDominantDecade": "%s",
                  "keyObservations": ["Observation 1", "Observation 2", "Observation 3"],
                  "recommendedGenresToExplore": ["Genre 1", "Genre 2", "Genre 3"]
                }

                User Metrics:
                - Total Saved Albums: %d
                - Average Rating: %.2f / 5.0
                - Top Genre: %s
                - Top Release Year: %s
                - Average Track Count: %.1f
                """, topDecade, analytics.getTotalAlbums(), analytics.getAverageRating(), topGenre, topDecade,
                analytics.getAverageTrackCount());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content",
                        "You are an expert musicologist AI. Respond ONLY in raw valid JSON without markdown formatting."),
                Map.of("role", "user", "content", promptText)));
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String content = rootNode.path("choices").get(0).path("message").path("content").asText();

            content = content.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode jsonResult = objectMapper.readTree(content);

            List<String> keyObs = new ArrayList<>();
            if (jsonResult.has("keyObservations")) {
                jsonResult.get("keyObservations").forEach(node -> keyObs.add(node.asText()));
            }

            List<String> recGenres = new ArrayList<>();
            if (jsonResult.has("recommendedGenresToExplore")) {
                jsonResult.get("recommendedGenresToExplore").forEach(node -> recGenres.add(node.asText()));
            }

            return TrendSummaryResponse.builder()
                    .musicPersona(jsonResult.path("musicPersona").asText("Aesthetic Cataloguer"))
                    .summary(jsonResult.path("summary")
                            .asText("A finely curated collection reflecting diverse artistic tastes."))
                    .topDominantDecade(jsonResult.path("topDominantDecade").asText(topDecade))
                    .keyObservations(keyObs)
                    .recommendedGenresToExplore(recGenres)
                    .generatedAt(LocalDateTime.now())
                    .build();
        }
        return null;
    }

    private TrendSummaryResponse generateLocalFallbackSummary(AnalyticsResponse analytics,
            TrendSummaryRequest request) {
        String topGenre = analytics.getAlbumsByGenre().isEmpty()
                ? "Eclectic Music"
                : analytics.getAlbumsByGenre().keySet().iterator().next();

        String topYear = analytics.getReleasesByYear().isEmpty()
                ? "Various Eras"
                : analytics.getReleasesByYear().keySet().iterator().next().toString();

        Double avgRating = analytics.getAverageRating();

        String persona = String.format("%s Connoisseur", topGenre);
        String summary = String.format(
                "Your catalog is strongly anchored in %s music. With an average album rating of %.2f out of 5 stars across %d saved projects, your personal library exhibits high artistic curation.",
                topGenre, avgRating, analytics.getTotalAlbums());

        List<String> observations = List.of(
                String.format("Primary genre concentration: %s.", topGenre),
                String.format("Key release era anchor: %s.", topYear),
                String.format("Average album length: %.1f tracks per collection.", analytics.getAverageTrackCount()));

        List<String> recs = List.of("Progressive Rock", "Synthwave", "Neo-Soul", "Post-Bop Jazz", "Indie Electronic");

        return TrendSummaryResponse.builder()
                .musicPersona(persona)
                .summary(summary)
                .topDominantDecade(topYear)
                .keyObservations(observations)
                .recommendedGenresToExplore(recs)
                .generatedAt(LocalDateTime.now())
                .build();
    }
}
