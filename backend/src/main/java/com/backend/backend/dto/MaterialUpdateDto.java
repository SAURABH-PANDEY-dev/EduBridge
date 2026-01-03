package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialUpdateDto {
    private String title;
    private String description;
    private String subject;
    private String semester;
    private String year;
    private String type; // NOTE, PYQ, PROJECT
}