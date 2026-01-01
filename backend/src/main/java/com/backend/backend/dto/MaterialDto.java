package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for uploading study materials.
 * Captures form data including the file itself.
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialDto {

    private LocalDateTime uploadDate;
    private String fileUrl;
    private Long id;
    private String title;
    private String description;
    private String subject;
    private String semester;
    private String year;
    private String uploadedBy;
    private String type;
    private MultipartFile file;
}