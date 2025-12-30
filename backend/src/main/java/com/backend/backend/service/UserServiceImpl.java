package com.backend.backend.service;

import com.backend.backend.dto.ChangePasswordDto;
import com.backend.backend.entity.User;
import com.backend.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.time.LocalDateTime;
import java.util.UUID;
import com.backend.backend.dto.ResetPasswordDto;

import com.backend.backend.dto.MaterialResponseDto;
import com.backend.backend.dto.UserDto;
import com.backend.backend.dto.UserResponseDto;
import com.backend.backend.entity.Material;
import com.backend.backend.entity.User;
import com.backend.backend.repository.MaterialRepository;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
/**
 * Implementation of UserService.
 * Contains the business logic for changing the user's password securely.
 */
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JavaMailSender mailSender;
    private final MaterialRepository materialRepository;

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

    // Method Implementation
    @Override
    public String forgotPassword(String email) {
        // 1. Check user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email!"));

        // 2. Generate Token
        String token = UUID.randomUUID().toString();

        // 3. Save Token to Database (Expires in 15 mins)
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // 4. Send Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("edubridge.support@gmail.com"); // Mail usd for sending the reset pass mail
        message.setTo(email);
        message.setSubject("EduBridge - Reset Password Request");
        message.setText("Hello " + user.getName() + ",\n\n" +
                "You have requested to reset your password.\n" +
                "Please use this token to set a new password:\n\n" +
                token + "\n\n" +
                "This token is valid for 15 minutes.\n" +
                "Team EduBridge");

        mailSender.send(message);

        return "Password reset email sent!";
    }

    @Override
    public String resetPassword(ResetPasswordDto resetPasswordDto) {

        // 1. Find user by Token
        User user = userRepository.findByResetPasswordToken(resetPasswordDto.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token!"));

        // 2. Check if Token has Expired
        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired! Please request a new one.");
        }

        // 3. Check if New Password matches Confirm Password
        if (!resetPasswordDto.getNewPassword().equals(resetPasswordDto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        // 4. Update Password
        user.setPassword(passwordEncoder.encode(resetPasswordDto.getNewPassword()));

        // 5. Clear the Token
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userRepository.save(user);

        return "Password successfully reset! You can now login.";
    }

    // Helper to get logged-in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public UserResponseDto getMyProfile() {
        User user = getCurrentUser();
        return mapToUserResponse(user);
    }

    @Override
    public UserResponseDto updateMyProfile(UserDto userDto) {
        User user = getCurrentUser();

        // Sirf wahi fields update karein jo allowed hain
        if (userDto.getName() != null) user.setName(userDto.getName());
        if (userDto.getUniversity() != null) user.setUniversity(userDto.getUniversity());

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public List<MaterialResponseDto> getMyUploads() {
        User user = getCurrentUser();
        // Repository mein ye method banana padega (Step 3 mein)
        List<Material> uploads = materialRepository.findByUploadedBy(user);

        return uploads.stream().map(this::mapToMaterialResponse).collect(Collectors.toList());
    }

    // --- Mappers ---
    private UserResponseDto mapToUserResponse(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setUniversity(user.getUniversity());
        dto.setRole(user.getRole().name());
        return dto;
    }

    private MaterialResponseDto mapToMaterialResponse(Material material) {
        MaterialResponseDto dto = new MaterialResponseDto();
        dto.setId(material.getId());
        dto.setTitle(material.getTitle());
        dto.setSubject(material.getSubject());
        dto.setStatus(material.getStatus()); // Ye field dashboard ke liye sabse important hai
        dto.setFileUrl(material.getFileUrl());
        dto.setType(material.getType());
        dto.setUploadDate(material.getUploadDate());
        return dto;
    }
}