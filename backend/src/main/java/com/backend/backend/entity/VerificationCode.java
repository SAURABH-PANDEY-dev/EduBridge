package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "verification_codes")
public class VerificationCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public VerificationCode(String email, String otp) {
        this.email = email;
        this.otp = otp;
        // OTP 10 minute tak valid rahega
        this.expiryDate = LocalDateTime.now().plusMinutes(10);
    }
}