package com.backend.backend.repository;

import com.backend.backend.entity.Post;
import com.backend.backend.entity.User;
import com.backend.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    // Check if a user has already voted on a specific post
    Optional<Vote> findByPostAndUser(Post post, User user);
}