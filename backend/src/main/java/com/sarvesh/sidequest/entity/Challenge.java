package com.sarvesh.sidequest.entity;

import com.sarvesh.sidequest.enums.Difficulty;
import com.sarvesh.sidequest.enums.Frequency;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Difficulty difficulty = Difficulty.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Frequency frequency = Frequency.DAILY;

    private int xpReward;

    private LocalDate startDate;
    private LocalDate endDate;
    
    // This is crucial for recurring challenges: when is the user supposed to do it next?
    private LocalDate nextDueDate;

    @Builder.Default
    private boolean isActive = true;

    // A challenge must belong to a goal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private Goal goal;
}