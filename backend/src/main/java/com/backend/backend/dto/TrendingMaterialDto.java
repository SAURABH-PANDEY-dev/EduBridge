package com.backend.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrendingMaterialDto {
    private String title;
    private String subject;
    private int downloadCount;
    private String uploadedBy;
}