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
}