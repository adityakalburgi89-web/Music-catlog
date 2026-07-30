package com.musiccatalog.controller;

import com.musiccatalog.dto.analytics.AnalyticsResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Personal music catalog database analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Fetch metrics and aggregation distributions for user's catalog")
    public ResponseEntity<AnalyticsResponse> getUserAnalytics(@AuthenticationPrincipal UserPrincipal currentUser) {
        AnalyticsResponse response = analyticsService.getUserAnalytics(currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
