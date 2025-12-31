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
}