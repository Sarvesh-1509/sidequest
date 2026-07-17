package com.sarvesh.sidequest.repository;

import com.sarvesh.sidequest.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    // Easily find all goals belonging to a logged-in user
    List<Goal> findByUserId(Long userId);
}