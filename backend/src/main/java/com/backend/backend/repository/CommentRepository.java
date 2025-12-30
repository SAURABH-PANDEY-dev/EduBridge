package com.backend.backend.repository;

import com.backend.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Find all comments for a specific post
    List<Comment> findByPostId(Long postId);
    List<Comment> findByUserOrderByCreationDateDesc(com.backend.backend.entity.User user);
}