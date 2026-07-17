package com.sarvesh.sidequest.controller;

import com.sarvesh.sidequest.dto.AnalyticsResponse;
import com.sarvesh.sidequest.entity.ChallengeHistory;
import com.sarvesh.sidequest.entity.User;
import com.sarvesh.sidequest.repository.ChallengeHistoryRepository;
import com.sarvesh.sidequest.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final UserRepository userRepository;
    private final ChallengeHistoryRepository historyRepository;

    public AnalyticsController(UserRepository userRepository, ChallengeHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAnalyticsData(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        // Fetch user's completion history sorted by completion date (descending)
        List<ChallengeHistory> historyList = historyRepository
                .findByChallengeGoalUserIdOrderByCompletedAtDesc(user.getId());

        // 1. Calculate high-level stats
        int totalCompleted = historyList.size();
        int totalXpEarned = historyList.stream()
                .mapToInt(ChallengeHistory::getXpEarned)
                .sum();

        // 2. Count completions by difficulty
        Map<String, Long> difficultyBreakdown = historyList.stream()
                .collect(Collectors.groupingBy(
                        h -> h.getChallenge().getDifficulty().name(),
                        Collectors.counting()
                ));

        // 3. Count completions by goal category
        Map<String, Long> categoryBreakdown = historyList.stream()
                .collect(Collectors.groupingBy(
                        h -> h.getChallenge().getGoal().getCategory().getName(),
                        Collectors.counting()
                ));

        // 4. Group completions by date (yyyy-MM-dd format)
        Map<String, Long> completionsByDate = historyList.stream()
                .collect(Collectors.groupingBy(
                        h -> h.getCompletedAt().toLocalDate().toString(),
                        Collectors.counting()
                ));

        // 5. Build recent completions list
        List<AnalyticsResponse.CompletedChallengeSummary> recentCompletions = historyList.stream()
                .map(h -> new AnalyticsResponse.CompletedChallengeSummary(
                        h.getId(),
                        h.getChallenge().getTitle(),
                        h.getChallenge().getGoal().getTitle(),
                        h.getChallenge().getDifficulty().name(),
                        h.getXpEarned(),
                        h.getCompletedAt().toString()
                ))
                .collect(Collectors.toList());

        AnalyticsResponse response = new AnalyticsResponse(
                totalCompleted,
                totalXpEarned,
                difficultyBreakdown,
                categoryBreakdown,
                completionsByDate,
                recentCompletions
        );

        return ResponseEntity.ok(response);
    }
}
