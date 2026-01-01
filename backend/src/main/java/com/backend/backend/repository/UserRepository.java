package com.backend.backend.repository;

import com.backend.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository interface for User entity.
 * Extends JpaRepository to provide standard CRUD operations (Create, Read, Update, Delete)
 * without writing any SQL queries manually.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Custom method to find a user by their email address.
     * Spring Data JPA automatically generates the SQL query based on the method name.
     *
     * @param email The email to search for.
     * @return An Optional containing the User if found, or empty if not.
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by their reset password token.
     * Used during the password reset process to verify validity.
     *
     * @param resetPasswordToken The token received from the user.
     * @return Optional User object.
     */
    Optional<User> findByResetPasswordToken(String resetPasswordToken);
    boolean existsByEmail(String email);
}