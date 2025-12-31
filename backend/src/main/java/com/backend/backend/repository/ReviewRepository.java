package com.backend.backend.repository;

import com.backend.backend.entity.Material;
import com.backend.backend.entity.Review;
import com.backend.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Check if a specific user has already reviewed a specific material.
     * Used to prevent duplicate reviews.
     */
    Optional<Review> findByUserAndMaterial(User user, Material material);
}