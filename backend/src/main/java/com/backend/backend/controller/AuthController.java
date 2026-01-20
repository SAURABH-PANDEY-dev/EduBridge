package com.backend.backend.controller;

import com.backend.backend.dto.RegisterDto;
import com.backend.backend.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.backend.dto.LoginDto;
import org.springframework.web.util.HtmlUtils;

import java.util.Collections;
import java.util.Map;

/**
 * REST Controller for Authentication endpoints.
 * This class handles incoming HTTP requests for registration and login.
 * It acts as a bridge between the frontend/client and the service layer.
 */
@AllArgsConstructor // Automatically injects dependencies (AuthService) via constructor
@RestController // Marks this class as a REST API controller, meaning methods return data (JSON), not HTML views
@RequestMapping("/api/auth") // Sets the base URL for all methods in this controller (e.g., http://localhost:8080/api/auth/...)
public class AuthController {

    private AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody RegisterDto registerDto) {
        try {
            String message = authService.sendRegistrationOtp(registerDto);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint to register a new user.
     * @param registerDto The user data sent in the request body (JSON).
     * @return ResponseEntity containing the success message and HTTP status code.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        try {
            // Service ab OTP verify karke hi user banayega
            return ResponseEntity.ok(authService.registerUser(registerDto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint to authenticate a user and return a JWT Token.
     *
     * @param loginDto Contains email and password.
     * @return ResponseEntity containing the JWT Token.
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto){

        // Authenticate and get the token from AuthService
        String token = authService.login(loginDto);

        // Return the token with HTTP Status 200 (OK)
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}