package com.sarvesh.sidequest.controller;

import com.sarvesh.sidequest.dto.GoalRequest;
import com.sarvesh.sidequest.entity.Category;
import com.sarvesh.sidequest.entity.Goal;
import com.sarvesh.sidequest.entity.User;
import com.sarvesh.sidequest.repository.CategoryRepository;
import com.sarvesh.sidequest.repository.GoalRepository;
import com.sarvesh.sidequest.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public GoalController(GoalRepository goalRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ResponseEntity<?> createGoal(@Valid @RequestBody GoalRequest request, Authentication authentication) {
        // 1. Get the currently logged-in user
        Optional<User> userOptional = userRepository.findByEmail(authentication.getName());
        if (userOptional.isEmpty()) return ResponseEntity.status(401).build();
        User currentUser = userOptional.get();

        // 2. Validate that the chosen category exists
        Optional<Category> categoryOptional = categoryRepository.findById(request.categoryId());
        if (categoryOptional.isEmpty()) return ResponseEntity.badRequest().body("Category not found");

        // 3. Build and save the Goal
        Goal goal = Goal.builder()
                .title(request.title())
                .description(request.description())
                .targetDate(request.targetDate())
                .priority(request.priority() != null ? request.priority() : com.sarvesh.sidequest.enums.Priority.MEDIUM)
                .color(request.color())
                .icon(request.icon())
                .user(currentUser)
                .category(categoryOptional.get())
                .build();

        goalRepository.save(goal);
        return ResponseEntity.ok("Goal created successfully!");
    }

    @GetMapping
    public ResponseEntity<?> getMyGoals(Authentication authentication) {
        Optional<User> user = userRepository.findByEmail(authentication.getName());
        if (user.isEmpty()) return ResponseEntity.status(401).build();

        List<Goal> goals = goalRepository.findByUserId(user.get().getId());
        
        // Convert the complex Goal entities into safe, simple maps for the frontend
        List<java.util.Map<String, Object>> safeGoals = goals.stream().map(goal -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", goal.getId());
            map.put("title", goal.getTitle());
            map.put("description", goal.getDescription());
            map.put("targetDate", goal.getTargetDate());
            map.put("priority", goal.getPriority());
            
            // Just send the category name, avoid loading the whole user/category object
            java.util.Map<String, String> categoryMap = new java.util.HashMap<>();
            categoryMap.put("name", goal.getCategory().getName());
            map.put("category", categoryMap);
            
            return map;
        }).toList();

        return ResponseEntity.ok(safeGoals);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id, Authentication authentication) {
        Optional<User> user = userRepository.findByEmail(authentication.getName());
        if (user.isEmpty()) return ResponseEntity.status(401).build();

        Optional<Goal> goalOptional = goalRepository.findById(id);
        if (goalOptional.isEmpty()) return ResponseEntity.notFound().build();

        Goal goal = goalOptional.get();

        // Security check: Ensure the user trying to delete it actually owns it
        if (!goal.getUser().getId().equals(user.get().getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this goal.");
        }

        goalRepository.delete(goal);
        return ResponseEntity.ok("Goal deleted successfully.");
    }
}