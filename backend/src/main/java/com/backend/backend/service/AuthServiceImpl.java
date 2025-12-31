package com.backend.backend.service;

import com.backend.backend.dto.LoginDto;
import com.backend.backend.dto.RegisterDto;
import com.backend.backend.entity.Role;
import com.backend.backend.entity.User;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.security.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Implementation of the AuthService interface.
 * Handles business logic for User Registration and User Login.
 */
@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager; // Handles authentication (User verification)
    private JwtTokenProvider jwtTokenProvider; // Utility to generate JWT tokens

    @Override
    public String register(RegisterDto registerDto) {

        // Check if the email already exists in the database
        Optional<User> existingUser = userRepository.findByEmail(registerDto.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        // Map DTO to User entity
        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword())); // Encrypt password
        user.setRole(Role.valueOf(registerDto.getRole()));

        // Save user to the database
        userRepository.save(user);

        return "User registered successfully!.";
    }

    @Override
    public String login(LoginDto loginDto) {

        // 1. Authenticate the user
        // This method automatically checks the email and password against the database.
        // If credentials are incorrect, it throws an exception.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        String email = authentication.getName();

        com.backend.backend.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found with email: " + email));

        if (user.isBlocked()) {
            throw new org.springframework.security.authentication.LockedException("Your account is blocked by Admin.");
        }
        // 2. Set the authentication object in the Security Context
        // This tells Spring Security that the current user is now logged in.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate JWT Token
        // Create a token string using the authenticated user's details.
        String token = jwtTokenProvider.generateToken(authentication);

        return token;
    }
}