package com.backend.backend.service;

import com.backend.backend.dto.AdminStatsDto;
import com.backend.backend.repository.MaterialRepository;
import com.backend.backend.repository.PostRepository;
import com.backend.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final PostRepository postRepository;

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
    public java.util.List<com.backend.backend.dto.UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> com.backend.backend.dto.UserResponseDto.builder()
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
        com.backend.backend.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(!user.isBlocked());
        userRepository.save(user);
    }
}