package com.backend.backend.service;

import com.backend.backend.dto.AdminStatsDto;
import com.backend.backend.dto.RegisterDto;
import com.backend.backend.dto.UserResponseDto;
import com.backend.backend.entity.Role;
import com.backend.backend.entity.User;
import com.backend.backend.repository.MaterialRepository;
import com.backend.backend.repository.PostRepository;
import com.backend.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminStatsDto getDashboardStats() {
        return AdminStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalMaterials(materialRepository.count())
                .pendingMaterials(materialRepository.countByStatus("PENDING")) // String "PENDING"
                .totalPosts(postRepository.count())
                .build();
    }

    @Override
    public java.util.List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .isBlocked(user.isBlocked())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }
    @Override
    public void toggleBlockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(!user.isBlocked());
        userRepository.save(user);
    }
    @Override
    public void createAdmin(RegisterDto registerDto) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists!");
        }

        // 2. Create User Entity
        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword())); // Hash Password

        // CRITICAL STEP: Set Role to ADMIN
        user.setRole(Role.ADMIN);

        user.setBlocked(false); // Active by default

        // 3. Save to DB
        userRepository.save(user);
    }
}