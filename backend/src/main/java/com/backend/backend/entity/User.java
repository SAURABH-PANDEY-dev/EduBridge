package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a User entity in the system.
 * This class maps directly to the 'users' table in the database.
 */
@Entity
@Table(name = "users") // Specifies the table name in the database
@Data // Generates Getters, Setters, toString, equals, and hashCode methods automatically via Lombok
@NoArgsConstructor // Generates a no-argument constructor (Required by Hibernate/JPA)
@AllArgsConstructor // Generates a constructor with all arguments (Useful for object creation)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configures auto-increment strategy for the primary key
    private Long id;

    @Column(nullable = false) // Ensures this column cannot be null in the database
    private String name;

    @Column(nullable = false, unique = true) // Ensures email is mandatory and must be unique across all users
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Stores the Enum as a String ("STUDENT") in the database
    @Column(nullable = false)
    private Role role; // Stores the user's role ("STUDENT", "ADMIN")

    // Stores the token generated for password reset functionality
    private String resetPasswordToken;
    // Stores the time when the reset token will expire
    private java.time.LocalDateTime resetPasswordTokenExpiry;
    private String university;
    @Column(nullable = false)
    private boolean isBlocked = false; // True = User Blocked, False = Active
}