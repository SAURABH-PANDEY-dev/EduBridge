package com.backend.backend.service;

import com.backend.backend.dto.AdminStatsDto;

public interface AdminService {
    AdminStatsDto getDashboardStats();
    java.util.List<com.backend.backend.dto.UserResponseDto> getAllUsers();
    void toggleBlockUser(Long userId);
}