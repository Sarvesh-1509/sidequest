package com.sarvesh.sidequest.repository;

import com.sarvesh.sidequest.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Find all default categories OR categories custom made by a specific user
    List<Category> findByIsDefaultTrueOrUserId(Long userId);
}