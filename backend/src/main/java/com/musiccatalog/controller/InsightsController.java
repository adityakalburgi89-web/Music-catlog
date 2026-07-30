package com.musiccatalog.controller;

import com.musiccatalog.dto.insights.TrendSummaryRequest;
import com.musiccatalog.dto.insights.TrendSummaryResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightsController {

    private final AIService aiService;

    @PostMapping("/trend-summary")
    public ResponseEntity<TrendSummaryResponse> generateTrendSummary(
            @RequestBody(required = false) TrendSummaryRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (request == null) {
            request = new TrendSummaryRequest();
        }

        TrendSummaryResponse response = aiService.generateTrendSummary(currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }
}
