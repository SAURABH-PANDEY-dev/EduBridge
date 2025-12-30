package com.backend.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponseDto {
    private Long id;
    private String content;
    private LocalDateTime creationDate;

    // User details
    private String userName;
    private Long userId;
}