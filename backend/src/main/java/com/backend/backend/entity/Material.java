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
}