package com.backend.backend.service;

import com.backend.backend.dto.MaterialDto;
import com.backend.backend.dto.MaterialResponseDto;
import com.backend.backend.entity.Material;

import java.util.List;

/**
 * Service Interface for Study Material Management.
 * Defines business logic for uploading and retrieving materials.
 */
public interface MaterialService {

    /**
     * Handles the complete process of uploading a study material.
     * 1. Uploads file to Cloudinary.
     * 2. Sets status based on User Role (Admin -> Approved, Student -> Pending).
     * 3. Saves metadata to Database.
     *
     * @param materialDto The data and file from the frontend.
     * @return The saved Material entity.
     */
    MaterialResponseDto uploadMaterial(MaterialDto materialDto);

    /**
     * Retrieves a list of materials for students.
     * Only returns materials with "APPROVED" status.
     *
     * @return List of approved materials.
     */
    List<MaterialResponseDto> getAllApprovedMaterials();
    List<MaterialResponseDto> getPendingMaterials();
    // Approve a material
    void approveMaterial(Long id);
    void deleteMaterial(Long id);
    // Search materials with filters
    List<MaterialResponseDto> searchMaterials(String subject, String semester, String type, String query);
    // Increment count and return the actual file URL
    String downloadMaterial(Long id);
    // Add a review to a material
    com.backend.backend.dto.ReviewDto addReview(Long materialId, com.backend.backend.dto.ReviewDto reviewDto);
}
