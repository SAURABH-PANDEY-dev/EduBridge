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
}