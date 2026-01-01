package com.backend.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SupportResponseDto {
    private Long id;
    private String userName;
    private String userEmail;
    private String subject;
    private String message;
    private String adminReply;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}