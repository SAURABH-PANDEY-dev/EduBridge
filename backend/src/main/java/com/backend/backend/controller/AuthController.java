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

    /**
     * Endpoint to register a new user.
     * URL: POST http://localhost:8080/api/auth/register
     *
     * @param registerDto The user data sent in the request body (JSON).
     * @return ResponseEntity containing the success message and HTTP status code.
     */
    @PostMapping("/register") // Maps HTTP POST requests to this method
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {

        // Call the service layer to perform the business logic (validation, saving to DB)
        String response = authService.register(registerDto);

        // Return the response with HTTP Status 201 (Created)
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint to authenticate a user and return a JWT Token.
     * URL: POST http://localhost:8080/api/auth/login
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