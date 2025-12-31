package com.backend.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDto {
    private long totalUsers;
    private long totalMaterials;
    private long pendingMaterials;
    private long totalPosts;
}