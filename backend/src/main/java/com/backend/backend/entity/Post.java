package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String category; // e.g., "Doubt", "General", "Project Help"

    @CreationTimestamp
    private LocalDateTime creationDate;

    // User who posted
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // One post have multiple comments
    // CascadeType.ALL means: Post delete means comments delete
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;
    private Integer viewCount = 0; // To track how many people viewed it
    private Integer voteCount = 0; // Stores total score (Upvotes - Downvotes)
    // Relationship with Votes (One Post -> Many Votes)
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Vote> votes;
}