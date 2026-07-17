package com.sarvesh.sidequest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZoneId;

@Entity
@Table(name = "users")
@Data // Lombok: Generates Getters, Setters, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profilePicture;

    @Builder.Default
    private String timezone = ZoneId.systemDefault().getId();

    @Builder.Default
    private String themePreference = "DARK";

    @Builder.Default
    private boolean notificationsEnabled = true;

    // Gamification Stats
    @Builder.Default
    private int currentXp = 0;

    @Builder.Default
    private int currentLevel = 1;

    @Builder.Default
    private int currentStreak = 0;

    @Builder.Default
    private int longestStreak = 0;
}