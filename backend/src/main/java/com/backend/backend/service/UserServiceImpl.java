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
}