package com.backend.backend.service;

import com.backend.backend.dto.MaterialDto;
import com.backend.backend.dto.MaterialResponseDto;
import com.backend.backend.entity.Material;
import com.backend.backend.entity.User;
import com.backend.backend.repository.MaterialRepository;
import com.backend.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public MaterialResponseDto uploadMaterial(MaterialDto materialDto) {

        // 1. Get the currently logged-in user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Upload the file to Cloudinary and get the URL
        String fileUrl = cloudinaryService.uploadFile(materialDto.getFile());

        // 3. Create the Material Entity and Map fields
        Material material = new Material();
        material.setTitle(materialDto.getTitle());
        material.setDescription(materialDto.getDescription());
        material.setSubject(materialDto.getSubject());
        material.setSemester(materialDto.getSemester());
        material.setYear(materialDto.getYear());
        material.setType(materialDto.getType());
        material.setFileUrl(fileUrl);
        material.setUploadedBy(currentUser);

        // 4. Set Status based on Role
        // If the user is an ADMIN, auto-approve. Otherwise, set to PENDING.
        // Note: We check if the role name contains "ADMIN" just to be safe.
        if (currentUser.getRole().name().equals("ADMIN")) {
            material.setStatus("APPROVED");
        } else {
            material.setStatus("PENDING");
        }

        // 5. Save to Database
        Material savedMaterial = materialRepository.save(material);
        return mapToDto(savedMaterial);
    }
    // Helper method to convert Entity to Response DTO
    private MaterialResponseDto mapToDto(Material material) {
        MaterialResponseDto responseDto = new MaterialResponseDto();
        responseDto.setId(material.getId());
        responseDto.setTitle(material.getTitle());
        responseDto.setDescription(material.getDescription());
        responseDto.setSubject(material.getSubject());
        responseDto.setType(material.getType());
        responseDto.setFileUrl(material.getFileUrl());
        responseDto.setStatus(material.getStatus());
        responseDto.setUploadDate(material.getUploadDate());
        responseDto.setUploadedBy(material.getUploadedBy().getName());
        return responseDto;
    }

    @Override
    public List<Material> getAllApprovedMaterials() {
        // Only return materials that have been approved by an Admin
        return materialRepository.findByStatus("APPROVED");
    }

    @Override
    public List<MaterialResponseDto> getPendingMaterials() {
        // Fetch all materials from DB with status "PENDING"
        List<Material> pendingMaterials = materialRepository.findByStatus("PENDING");

        // Convert them to DTOs so passwords are hidden
        return pendingMaterials.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public void approveMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));

        material.setStatus("APPROVED");
        materialRepository.save(material);
    }
}