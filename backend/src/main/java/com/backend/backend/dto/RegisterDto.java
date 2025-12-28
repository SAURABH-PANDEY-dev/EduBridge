package com.backend.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

/**
 * Data Transfer Object (DTO) for User Registration.
 * This class captures the raw data sent from the frontend during sign-up.
 * It includes validation rules to ensure data integrity before processing.
 */
@Data // Lombok: Generates getters, setters, and toString methods automatically
public class RegisterDto {

    @NotBlank(message = "Name is required") // Ensures the name is not null or empty
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format") // Validates that the string is a valid email address
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long") // Enforces minimum password length
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "STUDENT|ADMIN", message = "Role must be either STUDENT or ADMIN") // Ensures only specific values are accepted
    private String role;
}