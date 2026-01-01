package com.backend.backend.controller;

import com.backend.backend.dto.AdminStatsDto;
import com.backend.backend.dto.RegisterDto;
import com.backend.backend.dto.UserResponseDto;
import com.backend.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<java.util.List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 2. Block/Unblock User
    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<String> toggleBlockUser(@PathVariable Long id) {
        adminService.toggleBlockUser(id);
        return ResponseEntity.ok("User block status updated successfully.");
    }
    // Create New Admin
    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin(@RequestBody RegisterDto registerDto) {
        adminService.createAdmin(registerDto);
        return new ResponseEntity<>("New Admin registered successfully!", HttpStatus.CREATED);
    }
}