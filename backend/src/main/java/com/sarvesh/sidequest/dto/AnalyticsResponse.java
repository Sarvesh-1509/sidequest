package com.sarvesh.sidequest.dto;

import java.util.List;
import java.util.Map;

public record AnalyticsResponse(
        int totalCompleted,
        int totalXpEarned,
        Map<String, Long> difficultyBreakdown,
        Map<String, Long> categoryBreakdown,
        Map<String, Long> completionsByDate,
        List<CompletedChallengeSummary> recentCompletions
) {
    public record CompletedChallengeSummary(
            Long id,
            String title,
            String goalTitle,
            String difficulty,
            int xpEarned,
            String completedAt
    ) {}
}
