package com.backend.backend.dto;

import lombok.Data;

@Data
public class CommentDto {
    private String content;
    private Long postId; // Kis post par comment karna hai
}