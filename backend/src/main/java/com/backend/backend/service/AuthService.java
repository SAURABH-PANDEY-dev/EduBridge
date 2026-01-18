package com.backend.backend.service;

import com.backend.backend.dto.RegisterDto;
import com.backend.backend.dto.LoginDto;

/**
 * Service Interface for Authentication.
 * This defines the methods available for user registration and login.
 * The actual logic will be written in the implementation class.
 */
public interface AuthService {

    /**
     * Registers a new user in the system.
     *
     * @param registerDto The data sent from the frontend (name, email, password, role).
     * @return A success message or the registered user's data.
     */
    String register(RegisterDto registerDto);

    /**
     * Authenticates a user and returns a JWT Token.
     * @param loginDto Contains email and password.
     * @return A JWT Token string.
     */
    String login(LoginDto loginDto);

    String sendRegistrationOtp(RegisterDto registerDto);
    String registerUser(RegisterDto registerDto);
}