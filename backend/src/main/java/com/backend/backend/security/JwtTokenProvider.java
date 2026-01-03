package com.backend.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Utility class to generate and validate JWT Tokens.
 * This acts as a factory that creates a digital pass (Token) for logged-in users.
 */
@Component // Makes this class a Spring Bean so we can inject it into other classes
public class JwtTokenProvider {

    // Reads the secret key from application.properties
    @Value("${application.security.jwt.secret-key}")
    private String jwtSecret;

    // Reads the expiration time from application.properties
    @Value("${application.security.jwt.expiration}")
    private long jwtExpirationDate;

    /**
     * Generates a JWT Token for an authenticated user.
     *
     * @param authentication The authentication object containing user details.
     * @return A String representing the JWT token.
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        return Jwts.builder()
                .setSubject(username) // Who is this token for? (User's Email)
                .setIssuedAt(currentDate) // When was it created?
                .setExpiration(expireDate) // When will it expire?
                .signWith(key()) // Sign it with our secret key
                .compact();
    }

    /**
     * Decodes the secret key.
     * The key is stored in Base64 format in properties, so we need to decode it first.
     */
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    /**
     * Extracts the username (email) from the JWT token.
     * We will need this later to identify who the user is from the token.
     */
    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Validates the JWT token.
     * Checks if the token is tampered with or expired.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // If any error occurs (Expired, Invalid Signature, etc.), return false
            return false;
        }
    }
}