package com.sarvesh.sidequest.dto;

import com.sarvesh.sidequest.entity.Challenge;
import java.util.List;

public record DashboardResponse(
        String name,
        int currentLevel,
        int currentXp,
        int xpNeededForNextLevel,
        int currentStreak,
        int longestStreak,
        List<ChallengeSummary> todaysChallenges
) {
    // A smaller, cleaner version of the challenge to send to the frontend
    public record ChallengeSummary(
            Long id,
            String title,
            String goalTitle,
            String difficulty,
            int xpReward
    ) {}
}