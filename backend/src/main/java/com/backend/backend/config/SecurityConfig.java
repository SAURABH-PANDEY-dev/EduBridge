package com.backend.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

/**
 * Configuration class for Spring Security.
 * This class defines how users are authenticated and which URLs are accessible.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    /**
     * Creates a PasswordEncoder bean.
     * We use BCryptPasswordEncoder, which is a strong hashing algorithm.
     * This bean is injected into AuthServiceImpl to encrypt passwords.
     */
    @Bean
    public static PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the Security Filter Chain.
     * This method acts as a security guard for all incoming HTTP requests.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf((csrf) -> csrf.disable()) // Disabling CSRF as we will use JWT (Stateless)
                .authorizeHttpRequests((authorize) -> {
                    // Allow anyone to access the registration and login APIs
                    authorize.requestMatchers("/api/auth/**").permitAll();

                    // Lock down everything else - requires authentication
                    authorize.anyRequest().authenticated();
                });

        return http.build();
    }

    /**
     * Exposes the AuthenticationManager bean.
     * This manager allows us to verify user credentials (email/password) programmatically.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}