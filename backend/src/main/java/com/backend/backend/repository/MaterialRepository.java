package com.backend.backend.repository;

import com.backend.backend.entity.Material;
import com.backend.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

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

    long countByStatus(String status);
    // Search query to filter materials dynamically
    // It checks if a parameter is NULL; if so, it ignores that filter.
    @Query("SELECT m FROM Material m WHERE m.status = 'APPROVED' " +
            "AND (:subject IS NULL OR m.subject = :subject) " +
            "AND (:semester IS NULL OR m.semester = :semester) " +
            "AND (:type IS NULL OR m.type = :type) " +
            "AND (:query IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Material> searchMaterials(
            @Param("subject") String subject,
            @Param("semester") String semester,
            @Param("type") String type,
            @Param("query") String query
    );
    // Find all materials uploaded by a specific user
    List<Material> findByUploadedBy(User user);

}