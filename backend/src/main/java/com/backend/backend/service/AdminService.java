package com.backend.backend.service;

import com.backend.backend.dto.AdminStatsDto;
import com.backend.backend.dto.TopContributorDto;
import com.backend.backend.dto.TrendingMaterialDto;

import java.util.List;

public interface AdminService {
    AdminStatsDto getDashboardStats();
    java.util.List<com.backend.backend.dto.UserResponseDto> getAllUsers();
    void toggleBlockUser(Long userId);
    void createAdmin(com.backend.backend.dto.RegisterDto registerDto);

    List<TopContributorDto> getTopContributors();

    List<TrendingMaterialDto> getTrendingMaterials();
}