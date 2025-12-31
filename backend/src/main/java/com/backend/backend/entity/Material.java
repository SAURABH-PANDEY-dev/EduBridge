package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String subject; // e.g., "Java"

    private String semester;

    private String year;

    // Type: NOTE, PYQ, PROJECT
    @Column(nullable = false)
    private String type;

    // Cloudinary URL
    @Column(nullable = false)
    private String fileUrl;

    // Status: PENDING (Default) -> APPROVED
    @Column(nullable = false)
    private String status = "PENDING";

    private int downloadCount = 0;

    @CreationTimestamp
    private LocalDateTime uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User uploadedBy;

    // Relationship: One Material has Many Reviews
    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Review> reviews;

    /**
     * Virtual Getter for Average Rating.
     * Included automatically in JSON response as "averageRating".
     */
    public Double getAverageRating() {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }
        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        // Round to 1 decimal place (e.g., 4.5)
        return Math.round(avg * 10.0) / 10.0;
    }

    /**
     * Virtual Getter for Total Review Count.
     * Included automatically in JSON response as "totalReviews".
     */
    public Integer getTotalReviews() {
        return (reviews == null) ? 0 : reviews.size();
    }
}