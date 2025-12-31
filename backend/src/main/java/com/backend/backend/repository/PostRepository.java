package com.backend.backend.repository;

import com.backend.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Fetch all posts ordered by latest first
    List<Post> findAllByOrderByCreationDateDesc();
    List<Post> findByUserOrderByCreationDateDesc(com.backend.backend.entity.User user);
    // 1. Search by Title OR Content (Case Insensitive)
    java.util.List<com.backend.backend.entity.Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);

    // 2. Filter by Category (e.g., "Java", "Doubt")
    java.util.List<com.backend.backend.entity.Post> findByCategory(String category);
}