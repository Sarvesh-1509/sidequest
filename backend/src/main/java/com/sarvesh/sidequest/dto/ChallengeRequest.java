package com.sarvesh.sidequest.dto;

import com.sarvesh.sidequest.enums.Difficulty;
import com.sarvesh.sidequest.enums.Frequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ChallengeRequest(
        @NotBlank(message = "Title is required")
        String title,
        
        String description,
        
        @NotNull(message = "Goal ID is required")
        Long goalId,
        
        Difficulty difficulty,
        
        Frequency frequency,
        
        int xpReward,
        
        LocalDate startDate
) {}