package com.sarvesh.sidequest.controller;

import com.sarvesh.sidequest.dto.DashboardResponse;
import com.sarvesh.sidequest.entity.Challenge;
import com.sarvesh.sidequest.entity.User;
import com.sarvesh.sidequest.repository.ChallengeRepository;
import com.sarvesh.sidequest.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;

    public DashboardController(UserRepository userRepository, ChallengeRepository challengeRepository) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
    }

    @GetMapping
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        // 1. Get the current user
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        // 2. Calculate XP needed for next level (Level * 100)
        int xpNeeded = user.getCurrentLevel() * 100;

        // 3. Fetch challenges due today or overdue
        List<Challenge> rawChallenges = challengeRepository
                .findByGoalUserIdAndIsActiveTrueAndNextDueDateLessThanEqual(user.getId(), LocalDate.now());

        // 4. Convert them into our clean ChallengeSummary objects
        List<DashboardResponse.ChallengeSummary> todayChallenges = rawChallenges.stream()
                .map(c -> new DashboardResponse.ChallengeSummary(
                        c.getId(),
                        c.getTitle(),
                        c.getGoal().getTitle(),
                        c.getDifficulty().name(),
                        c.getXpReward()
                )).collect(Collectors.toList());

        // 5. Build and return the response
        DashboardResponse response = new DashboardResponse(
                user.getName(),
                user.getCurrentLevel(),
                user.getCurrentXp(),
                xpNeeded,
                user.getCurrentStreak(),
                user.getLongestStreak(),
                todayChallenges
        );

        return ResponseEntity.ok(response);
    }
}