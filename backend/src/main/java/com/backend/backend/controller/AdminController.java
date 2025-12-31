package com.backend.backend.controller;

import com.backend.backend.dto.AdminStatsDto;
import com.backend.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // 1. Get All Users
    @GetMapping("/users")
    public ResponseEntity<java.util.List<com.backend.backend.dto.UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 2. Block/Unblock User
    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<String> toggleBlockUser(@PathVariable Long id) {
        adminService.toggleBlockUser(id);
        return ResponseEntity.ok("User block status updated successfully.");
    }
}