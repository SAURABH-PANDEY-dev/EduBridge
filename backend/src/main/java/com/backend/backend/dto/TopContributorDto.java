package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopContributorDto {
    private String name;
    private Long uploadCount;
}