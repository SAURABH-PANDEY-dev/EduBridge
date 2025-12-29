package com.backend.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

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
}