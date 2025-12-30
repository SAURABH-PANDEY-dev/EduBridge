package com.backend.backend.controller;

import com.backend.backend.dto.ChangePasswordDto;
import com.backend.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.backend.dto.ForgotPasswordDto;
import com.backend.backend.dto.ResetPasswordDto;
import com.backend.backend.dto.MaterialResponseDto;
import com.backend.backend.dto.UserDto;
import com.backend.backend.dto.UserResponseDto;
import com.backend.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for User Profile operations.
 * Handles endpoints related to user updates.
 */
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    /**
     * Endpoint to change the logged-in user's password.
     * URL: POST http://localhost:8080/api/users/change-password
     * * @param changePasswordDto The request body containing password details.
     * @return Success message.
     */
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto changePasswordDto) {
        String response = userService.changePassword(changePasswordDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto) {
        String response = userService.forgotPassword(forgotPasswordDto.getEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Endpoint to reset password using the token.
     * URL: POST http://localhost:8080/api/users/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        String response = userService.resetPassword(resetPasswordDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //  Get My Profile
    @GetMapping("/profile")
    public ResponseEntity<UserResponseDto> getMyProfile() {
        return new ResponseEntity<>(userService.getMyProfile(), HttpStatus.OK);
    }

    //Update My Profile (Name/University)
    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto> updateProfile(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.updateMyProfile(userDto), HttpStatus.OK);
    }

    //Get My Uploads (Dashboard)
    @GetMapping("/uploads")
    public ResponseEntity<List<MaterialResponseDto>> getMyUploads() {
        return new ResponseEntity<>(userService.getMyUploads(), HttpStatus.OK);
    }
}