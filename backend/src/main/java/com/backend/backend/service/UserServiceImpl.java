package com.backend.backend.service;

import com.backend.backend.dto.ChangePasswordDto;
import com.backend.backend.entity.User;
import com.backend.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Implementation of UserService.
 * Contains the business logic for changing the user's password securely.
 */
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public String changePassword(ChangePasswordDto changePasswordDto) {

        // 1. Get the currently logged-in user's email from the Security Context
        // When a user is logged in with a Token, Spring Security stores their email here.
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Fetch the user from the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3. Validate that the Current Password matches the one in the database
        // passwordEncoder.matches(rawPassword, encodedPassword) checks if they are the same.
        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password!");
        }

        // 4. Validate that New Password and Confirmation Password match
        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmationPassword())) {
            throw new RuntimeException("New password and confirmation password do not match!");
        }

        // 5. Encrypt the new password and save it
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully!";
    }
}