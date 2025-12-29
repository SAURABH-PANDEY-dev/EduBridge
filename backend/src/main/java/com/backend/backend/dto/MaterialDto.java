package com.backend.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * Data Transfer Object for uploading study materials.
 * Captures form data including the file itself.
 */
@Data
public class MaterialDto {

    private String title;
    private String description;
    private String subject;
    private String semester;
    private String year;

    // Values: NOTE, PYQ, PROJECT
    private String type;

    // This field captures the actual file uploaded by the user
    private MultipartFile file;
}