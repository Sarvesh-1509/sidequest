package com.sarvesh.sidequest.controller;

import com.sarvesh.sidequest.entity.Category;
import com.sarvesh.sidequest.entity.User;
import com.sarvesh.sidequest.repository.CategoryRepository;
import com.sarvesh.sidequest.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryController(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getUserCategories(Authentication authentication) {
        // Find the user making the request based on their JWT token
        Optional<User> user = userRepository.findByEmail(authentication.getName());
        if (user.isEmpty()) return ResponseEntity.status(401).build();

        // Fetch default categories + user's custom categories
        List<Category> categories = categoryRepository.findByIsDefaultTrueOrUserId(user.get().getId());
        return ResponseEntity.ok(categories);
    }
}