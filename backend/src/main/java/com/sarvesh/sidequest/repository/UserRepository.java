package com.sarvesh.sidequest.repository;

import com.sarvesh.sidequest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Boot magically writes the SQL for this based on the method name!
    Optional<User> findByEmail(String email);
}