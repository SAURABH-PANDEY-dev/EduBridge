package com.backend.backend.service;

import com.backend.backend.dto.ChangePasswordDto;

/**
 * Service Interface for User Profile Management.
 * Handles actions related to the logged-in user, such as changing passwords.
 */
public interface UserService {

    /**
     * Changes the password for the currently logged-in user.
     * * @param changePasswordDto The data containing current and new passwords.
     * @return A success message string.
     */
    String changePassword(ChangePasswordDto changePasswordDto);
}