package com.sarvesh.sidequest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    private int xpEarned;

    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
}