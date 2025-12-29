package com.backend.backend.dto;

import lombok.Data;

/**
 * Data Transfer Object for changing the password.
 * Captures the current password, the new password, and the confirmation password.
 */
@Data
public class ChangePasswordDto {

    // The password currently stored in the database
    private String currentPassword;

    // The new password the user wants to set
    private String newPassword;

    // Repetition of the new password to prevent typing errors
    private String confirmationPassword;
}