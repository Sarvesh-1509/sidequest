package com.sarvesh.sidequest.controller;

import com.sarvesh.sidequest.dto.ChallengeRequest;
import com.sarvesh.sidequest.entity.Challenge;
import com.sarvesh.sidequest.entity.ChallengeHistory;
import com.sarvesh.sidequest.entity.Goal;
import com.sarvesh.sidequest.entity.User;
import com.sarvesh.sidequest.repository.ChallengeHistoryRepository;
import com.sarvesh.sidequest.repository.ChallengeRepository;
import com.sarvesh.sidequest.repository.GoalRepository;
import com.sarvesh.sidequest.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeRepository challengeRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final ChallengeHistoryRepository historyRepository;

    public ChallengeController(ChallengeRepository challengeRepository, GoalRepository goalRepository, 
                               UserRepository userRepository, ChallengeHistoryRepository historyRepository) {
        this.challengeRepository = challengeRepository;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    @PostMapping
    public ResponseEntity<?> createChallenge(@Valid @RequestBody ChallengeRequest request) {
        Optional<Goal> goalOptional = goalRepository.findById(request.goalId());
        if (goalOptional.isEmpty()) return ResponseEntity.badRequest().body("Goal not found");

        LocalDate initialDueDate = request.startDate() != null ? request.startDate() : LocalDate.now();
        
        com.sarvesh.sidequest.enums.Difficulty challengeDifficulty = 
            request.difficulty() != null ? request.difficulty() : com.sarvesh.sidequest.enums.Difficulty.MEDIUM;

        int calculatedXp = switch (challengeDifficulty) {
            case EASY -> 25;
            case MEDIUM -> 50;
            case HARD -> 100;
            case EPIC -> 250;
        };

        Challenge challenge = Challenge.builder()
                .title(request.title())
                .description(request.description())
                .goal(goalOptional.get())
                .difficulty(challengeDifficulty)
                .frequency(request.frequency() != null ? request.frequency() : com.sarvesh.sidequest.enums.Frequency.DAILY)
                .xpReward(calculatedXp)
                .startDate(initialDueDate)
                .nextDueDate(initialDueDate)
                .build();

        challengeRepository.save(challenge);
        return ResponseEntity.ok("Challenge created successfully!");
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeChallenge(@PathVariable Long id, Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();

        Optional<Challenge> challengeOptional = challengeRepository.findById(id);
        if (challengeOptional.isEmpty()) return ResponseEntity.badRequest().body("Challenge not found");
        Challenge challenge = challengeOptional.get();

        if (!challenge.getGoal().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You do not own this challenge!");
        }

        ChallengeHistory history = ChallengeHistory.builder()
                .challenge(challenge)
                .xpEarned(challenge.getXpReward())
                .completedAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        int currentXp = currentUser.getCurrentXp() + challenge.getXpReward();
        int xpNeededForNextLevel = currentUser.getCurrentLevel() * 100;
        boolean leveledUp = false;

        if (currentXp >= xpNeededForNextLevel) {
            currentUser.setCurrentLevel(currentUser.getCurrentLevel() + 1);
            currentUser.setCurrentXp(currentXp - xpNeededForNextLevel); 
            leveledUp = true;
        } else {
            currentUser.setCurrentXp(currentXp);
        }
        userRepository.save(currentUser);

        LocalDate nextDate = switch (challenge.getFrequency()) {
            case DAILY -> LocalDate.now().plusDays(1);
            case WEEKLY -> LocalDate.now().plusWeeks(1);
            case MONTHLY -> LocalDate.now().plusMonths(1);
            case YEARLY -> LocalDate.now().plusYears(1);
            case ONCE -> null;
        };

        challenge.setNextDueDate(nextDate);
        if (nextDate == null) challenge.setActive(false); 
        challengeRepository.save(challenge);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Challenge completed!");
        response.put("xpEarned", challenge.getXpReward());
        response.put("currentLevel", currentUser.getCurrentLevel());
        response.put("currentXp", currentUser.getCurrentXp());
        response.put("leveledUp", leveledUp);

        return ResponseEntity.ok(response);
    }
}