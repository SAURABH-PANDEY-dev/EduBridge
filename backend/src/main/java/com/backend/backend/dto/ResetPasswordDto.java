package com.backend.backend.dto;

import lombok.Data;

@Data
public class ResetPasswordDto {
    private String token;
    private String newPassword;
    private String confirmPassword;
}