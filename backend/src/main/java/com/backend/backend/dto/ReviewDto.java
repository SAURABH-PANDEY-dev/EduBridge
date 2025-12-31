package com.backend.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private int rating; // 1 to 5
    private String comment;
    private Long id;
    private String userName;
    private LocalDateTime createdAt;
}