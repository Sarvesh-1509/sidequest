package com.sarvesh.sidequest.repository;

import com.sarvesh.sidequest.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByGoalId(Long goalId);
    
    // NEW: Find all active challenges for a user due on or before a specific date
    List<Challenge> findByGoalUserIdAndIsActiveTrueAndNextDueDateLessThanEqual(Long userId, LocalDate date);
}