package com.backend.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String category;
    private LocalDateTime creationDate;

    // User details (Safe ones only)
    private String userName;
    private Long userId;

    // Extra info
    private int commentCount;
}