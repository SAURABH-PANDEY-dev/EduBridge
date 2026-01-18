package com.backend.backend.service;

import com.backend.backend.dto.LoginDto;
import com.backend.backend.dto.RegisterDto;
import com.backend.backend.entity.Role;
import com.backend.backend.entity.User;
import com.backend.backend.entity.VerificationCode;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.repository.VerificationCodeRepository;
import com.backend.backend.security.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

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
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;

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

    @Override
    @Transactional
    public String sendRegistrationOtp(RegisterDto registerDto) {

        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }


        String otp = String.valueOf(100000 + new Random().nextInt(900000));


        VerificationCode codeEntry = verificationCodeRepository.findByEmail(registerDto.getEmail())
                .orElse(new VerificationCode(registerDto.getEmail(), otp));

        codeEntry.setOtp(otp);
        codeEntry.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        verificationCodeRepository.save(codeEntry);


        emailService.sendSimpleEmail(registerDto.getEmail(), "Verify your Account", "Your Registration OTP is: " + otp);

        return "OTP sent successfully to " + registerDto.getEmail();
    }

    @Override
    @Transactional
    public String registerUser(RegisterDto registerDto) {

        VerificationCode vc = verificationCodeRepository.findByEmail(registerDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Please registerDto OTP first."));

        if (vc.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired.");
        }

        if (!vc.getOtp().equals(registerDto.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }


        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));


        try {
            user.setRole(Role.valueOf(registerDto.getRole().toUpperCase()));
        } catch (Exception e) {
            user.setRole(Role.STUDENT); // Default fallback
        }

        User savedUser = userRepository.save(user);

        verificationCodeRepository.delete(vc);

        return "User registered successfully!.";
    }
}