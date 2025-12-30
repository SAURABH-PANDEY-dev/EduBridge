package com.backend.backend.dto;

import lombok.Data;

@Data
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String university;
    private String role;
}