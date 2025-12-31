package com.backend.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
/**
 * DTO for sending Material data to the client.
 * Hides sensitive user information like passwords.
 */
@Data
public class MaterialResponseDto {
    private Long id;
    private String title;
    private String description;
    private String subject;
    private String type;
    private String fileUrl;
    private String status;
    private LocalDateTime uploadDate;
    private String uploadedBy;
    private Double averageRating;
    private Integer totalReviews;
    private List<ReviewDto> reviews;
}