package com.backend.backend.config;

import com.backend.backend.security.JwtAuthenticationFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

/**
 * Configuration class for Spring Security.
 * This class defines how users are authenticated and which URLs are accessible.
 */
@AllArgsConstructor
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private JwtAuthenticationFilter jwtAuthenticationFilter;

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

        http.csrf(AbstractHttpConfigurer::disable) // Disabling CSRF as we will use JWT (Stateless)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests((authorize) -> {
                    // Allow anyone to access these APIs
                    authorize.requestMatchers("/api/auth/**").permitAll();
                    authorize.requestMatchers("/api/users/forgot-password").permitAll();
                    authorize.requestMatchers("/api/users/reset-password").permitAll();
                    authorize.requestMatchers(HttpMethod.GET,"/api/materials/search").permitAll();
                    authorize.requestMatchers(HttpMethod.GET,"/api/materials").permitAll();
                    authorize.requestMatchers(HttpMethod.GET, "/api/materials/*/download").permitAll();
                    authorize.requestMatchers(HttpMethod.GET,"/api/forum/**").authenticated();
                    authorize.requestMatchers("/api/admin/**").hasAuthority("ADMIN");
                    authorize.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll();
                    authorize.anyRequest().authenticated();
                });
        // Add our custom JWT Filter before the standard UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
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
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}