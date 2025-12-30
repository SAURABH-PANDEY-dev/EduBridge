package com.backend.backend.controller;

import com.backend.backend.dto.MaterialDto;
import com.backend.backend.dto.MaterialResponseDto;
import com.backend.backend.entity.Material;
import com.backend.backend.service.MaterialService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@AllArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    /**
     * Endpoint to upload study material.
     * Expects 'multipart/form-data' because it includes a file.
     * * URL: POST http://localhost:8080/api/materials/upload
     * Authorization: Bearer <Token>
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialResponseDto> uploadMaterial(@ModelAttribute MaterialDto materialDto) {
        MaterialResponseDto savedMaterial = materialService.uploadMaterial(materialDto);
        return new ResponseEntity<>(savedMaterial, HttpStatus.CREATED);
    }

    /**
     * Endpoint to get all APPROVED materials for students.
     * * URL: GET http://localhost:8080/api/materials
     */
    @GetMapping
    public ResponseEntity<List<Material>> getAllApprovedMaterials() {
        List<Material> materials = materialService.getAllApprovedMaterials();
        return new ResponseEntity<>(materials, HttpStatus.OK);
    }

    /**
     * Endpoint for ADMIN to view all pending materials.
     * URL: GET http://localhost:8080/api/materials/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<MaterialResponseDto>> getPendingMaterials() {
        List<MaterialResponseDto> pendingMaterials = materialService.getPendingMaterials();
        return new ResponseEntity<>(pendingMaterials, HttpStatus.OK);
    }

    /**
     * Endpoint for ADMIN to approve a material.
     * URL: PUT http://localhost:8080/api/materials/{id}/approve
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveMaterial(@PathVariable Long id) {
        materialService.approveMaterial(id);
        return new ResponseEntity<>("Material approved successfully.", HttpStatus.OK);
    }

    /**
     * Endpoint for ADMIN to delete a material (DB + Cloudinary).
     * URL: DELETE http://localhost:8080/api/materials/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return new ResponseEntity<>("Material and associated file deleted successfully.", HttpStatus.OK);
    }

    /**
     * Endpoint to Search and Filter materials.
     * URL: GET http://localhost:8080/api/materials/search?subject=Java&semester=Semester 1
     * All parameters are optional.
     */
    @GetMapping("/search")
    public ResponseEntity<List<MaterialResponseDto>> searchMaterials(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String query) {

        List<MaterialResponseDto> materials = materialService.searchMaterials(subject, semester, type, query);
        return new ResponseEntity<>(materials, HttpStatus.OK);
    }
}