package com.backend.backend.repository;

import com.backend.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository interface for Material entity operations.
 * Handles database interactions for storing and retrieving study materials.
 */
public interface MaterialRepository extends JpaRepository<Material, Long> {

    /**
     * Finds all materials that match a specific status (e.g., "APPROVED").
     * Used to display content to students.
     * @param status The status to filter by.
     * @return List of materials.
     */
    List<Material> findByStatus(String status);

    /**
     * Finds materials by status and type (e.g., "APPROVED" and "NOTE").
     * Useful for filtering content on the frontend.
     * @param status The approval status.
     * @param type The type of material (NOTE, PYQ, PROJECT).
     * @return List of matching materials.
     */
    List<Material> findByStatusAndType(String status, String type);
}