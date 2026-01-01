package com.backend.backend.service;

import com.backend.backend.dto.MaterialDto;
import com.backend.backend.dto.MaterialResponseDto;
import com.backend.backend.entity.Material;
import com.backend.backend.entity.Review;
import com.backend.backend.entity.User;
import com.backend.backend.repository.MaterialRepository;
import com.backend.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.backend.entity.DownloadLog;
import com.backend.backend.repository.DownloadLogRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import com.backend.backend.repository.ReviewRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final DownloadLogRepository downloadLogRepository;
    private final ReviewRepository reviewRepository;
    private final EmailService emailService;

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

        if (material.getUploadedBy() != null) {
            responseDto.setUploadedBy(material.getUploadedBy().getName());
        }

        // Map Rating and Review List
        responseDto.setAverageRating(material.getAverageRating());
        responseDto.setTotalReviews(material.getTotalReviews());

        if (material.getReviews() != null) {
            List<com.backend.backend.dto.ReviewDto> reviewDtos = material.getReviews().stream()
                    .map(review -> {
                        com.backend.backend.dto.ReviewDto dto = new com.backend.backend.dto.ReviewDto();
                        dto.setId(review.getId());
                        dto.setRating(review.getRating());
                        dto.setComment(review.getComment());
                        if (review.getUser() != null) {
                            dto.setUserName(review.getUser().getName());
                        } else {
                            dto.setUserName("Anonymous");
                        }

                        dto.setCreatedAt(review.getCreatedAt());
                        return dto;
                    })
                    .collect(Collectors.toList());
            responseDto.setReviews(reviewDtos);
        }

        return responseDto;
    }


    @Override
    public List<MaterialResponseDto> getAllApprovedMaterials() {
        List<Material> materials = materialRepository.findByStatus("APPROVED");
        return materials.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
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

    String subject = "Material Approved! 🎉";
    String body = "Hi " + material.getUploadedBy().getName() + ",\n\nYour material '" + material.getTitle() + "' has been APPROVED and is now live on the platform.";

    emailService.sendSimpleEmail(material.getUploadedBy().getEmail(), subject, body);
}

    @Override
    public void deleteMaterial(Long id) {
        // 1. Get Current User
        User currentUser = getCurrentUser();

        // 2. Find the material
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));

        // 3. Security Check: Is User the Owner OR is User an ADMIN?
    boolean isOwner = material.getUploadedBy().getId().equals(currentUser.getId());
    boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

    if (!isOwner && !isAdmin) {
        throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this material.");
    }
    if (isAdmin && !isOwner) {
        String subject = "Material Deleted by Admin ⚠️";
        String body = "Hi " + material.getUploadedBy().getName()
                + ",\n\nYour material '" + material.getTitle()
                + "' was deleted by the Administrator due to content policy violations.";
        emailService.sendSimpleEmail(material.getUploadedBy().getEmail(), subject, body);
    }
        // 4. Delete the actual file from Cloudinary
        if (material.getFileUrl() != null) {
            cloudinaryService.deleteFile(material.getFileUrl());
        }

        // 5. Delete from Database
        materialRepository.delete(material);
    }
    @Override
    public List<MaterialResponseDto> searchMaterials(String subject, String semester, String type, String query) {
        // Fetch filtered data from the database
        List<Material> materials = materialRepository.searchMaterials(subject, semester, type, query);

        // Convert the entity list to DTO list
        return materials.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public String downloadMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        // 1. Counter++
        material.setDownloadCount(material.getDownloadCount() + 1);
        materialRepository.save(material);

        // 2. if User Logged-in then, History Log create
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            // Check if there is a "anonymousUser" user
            if (!email.equals("anonymousUser")) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    DownloadLog log = new DownloadLog();
                    log.setUser(user);
                    log.setMaterial(material);
                    downloadLogRepository.save(log);
                });
            }
        } catch (Exception e) {
            //Failed login does not stop the download
            System.out.println("Download logging failed: " + e.getMessage());
        }

        return material.getFileUrl();
    }
    // Helper method to get the currently logged-in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public com.backend.backend.dto.ReviewDto addReview(Long materialId, com.backend.backend.dto.ReviewDto reviewDto) {
        User user = getCurrentUser(); // Reuse existing helper

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        // Check for duplicate review
        if (reviewRepository.findByUserAndMaterial(user, material).isPresent()) {
            throw new RuntimeException("You have already reviewed this material!");
        }

        Review review = new Review();
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setUser(user);
        review.setMaterial(material);

        Review savedReview = reviewRepository.save(review);

        // Map back to DTO
        com.backend.backend.dto.ReviewDto response = new com.backend.backend.dto.ReviewDto();
        response.setId(savedReview.getId());
        response.setRating(savedReview.getRating());
        response.setComment(savedReview.getComment());
        response.setUserName(user.getName());
        response.setCreatedAt(savedReview.getCreatedAt());

        return response;
    }
}