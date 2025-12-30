package com.backend.backend.dto;

import lombok.Data;

@Data
public class PostDto {
    private String title;
    private String content;
    private String category; // e.g., "Doubt", "General"
}