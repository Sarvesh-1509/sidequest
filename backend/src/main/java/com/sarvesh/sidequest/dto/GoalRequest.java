package com.sarvesh.sidequest.dto;

import com.sarvesh.sidequest.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record GoalRequest(
        @NotBlank(message = "Title is required")
        String title,
        
        String description,
        
        LocalDate targetDate,
        
        Priority priority,
        
        @NotNull(message = "Category is required")
        Long categoryId,
        
        String color,
        
        String icon
) {}