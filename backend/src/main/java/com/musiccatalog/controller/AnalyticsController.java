package com.musiccatalog.controller;

import com.musiccatalog.dto.analytics.AnalyticsResponse;
import com.musiccatalog.security.UserPrincipal;
import com.musiccatalog.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getUserAnalytics(@AuthenticationPrincipal UserPrincipal currentUser) {
        AnalyticsResponse response = analyticsService.getUserAnalytics(currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
