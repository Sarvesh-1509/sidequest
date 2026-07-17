package com.sarvesh.sidequest.repository;

import com.sarvesh.sidequest.entity.ChallengeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeHistoryRepository extends JpaRepository<ChallengeHistory, Long> {
    List<ChallengeHistory> findByChallengeGoalUserIdOrderByCompletedAtDesc(Long userId);
}