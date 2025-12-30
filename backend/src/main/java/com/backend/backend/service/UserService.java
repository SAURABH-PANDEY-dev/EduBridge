package com.backend.backend.service;

import com.backend.backend.dto.ChangePasswordDto;
import com.backend.backend.dto.ResetPasswordDto;
import com.backend.backend.dto.MaterialResponseDto;
import com.backend.backend.dto.UserDto;
import com.backend.backend.dto.UserResponseDto;
import java.util.List;

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
    String forgotPassword(String email);

    /**
     * Resets the password using a valid token.
     * @param resetPasswordDto Contains token and new password.
     * @return Success message.
     */
    String resetPassword(ResetPasswordDto resetPasswordDto);

    // Get current user profile
    UserResponseDto getMyProfile();

    // Update current user profile
    UserResponseDto updateMyProfile(UserDto userDto);

    // Get uploads by current user
    List<MaterialResponseDto> getMyUploads();
}