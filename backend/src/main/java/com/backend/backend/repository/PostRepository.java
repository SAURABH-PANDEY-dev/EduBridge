package com.backend.backend.repository;

import com.backend.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Fetch all posts ordered by latest first
    List<Post> findAllByOrderByCreationDateDesc();
    List<Post> findByUserOrderByCreationDateDesc(com.backend.backend.entity.User user);
}