package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.dto.PostResponseDto;
import com.backend.backend.entity.User;
import com.backend.backend.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.time.LocalDateTime;
import java.util.UUID;

import com.backend.backend.entity.Material;
import com.backend.backend.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
/**
 * Implementation of UserService.
 * Contains the business logic for changing the user's password securely.
 */
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JavaMailSender mailSender;
    private final MaterialRepository materialRepository;
    private final DownloadLogRepository downloadLogRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public String changePassword(ChangePasswordDto changePasswordDto) {

        // 1. Get the currently logged-in user's email from the Security Context
        // When a user is logged in with a Token, Spring Security stores their email here.
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Fetch the user from the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3. Validate that the Current Password matches the one in the database
        // passwordEncoder.matches(rawPassword, encodedPassword) checks if they are the same.
        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password!");
        }

        // 4. Validate that New Password and Confirmation Password match
        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmationPassword())) {
            throw new RuntimeException("New password and confirmation password do not match!");
        }

        // 5. Encrypt the new password and save it
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully!";
    }

    // Method Implementation
    @Override
    public String forgotPassword(String email) {
        // 1. Check user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email!"));

        // 2. Generate Token
        String token = UUID.randomUUID().toString();

        // 3. Save Token to Database (Expires in 15 mins)
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // 4. Send Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("edubridge.support@gmail.com"); // Mail usd for sending the reset pass mail
        message.setTo(email);
        message.setSubject("EduBridge - Reset Password Request");
        message.setText("Hello " + user.getName() + ",\n\n" +
                "You have requested to reset your password.\n" +
                "Please use this token to set a new password:\n\n" +
                token + "\n\n" +
                "This token is valid for 15 minutes.\n" +
                "Team EduBridge");

        mailSender.send(message);

        return "Password reset email sent!";
    }

    @Override
    public String resetPassword(ResetPasswordDto resetPasswordDto) {

        // 1. Find user by Token
        User user = userRepository.findByResetPasswordToken(resetPasswordDto.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token!"));

        // 2. Check if Token has Expired
        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired! Please request a new one.");
        }

        // 3. Check if New Password matches Confirm Password
        if (!resetPasswordDto.getNewPassword().equals(resetPasswordDto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        // 4. Update Password
        user.setPassword(passwordEncoder.encode(resetPasswordDto.getNewPassword()));

        // 5. Clear the Token
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userRepository.save(user);

        return "Password successfully reset! You can now login.";
    }

    // Helper to get logged-in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public UserResponseDto getMyProfile() {
        User user = getCurrentUser();
        return mapToUserResponse(user);
    }

    @Override
    public UserResponseDto updateMyProfile(UserDto userDto) {
        User user = getCurrentUser();
        if (userDto.getName() != null) user.setName(userDto.getName());
        if (userDto.getUniversity() != null) user.setUniversity(userDto.getUniversity());

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public List<MaterialResponseDto> getMyUploads() {
        User user = getCurrentUser();
        List<Material> uploads = materialRepository.findByUploadedBy(user);

        return uploads.stream().map(this::mapToMaterialResponse).collect(Collectors.toList());
    }

    // --- Mappers ---
    private UserResponseDto mapToUserResponse(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setUniversity(user.getUniversity());
        dto.setProfilePicUrl(user.getProfilePicUrl());
        dto.setRole(user.getRole().name());
        return dto;
    }

    private MaterialResponseDto mapToMaterialResponse(Material material) {
        MaterialResponseDto dto = new MaterialResponseDto();
        dto.setId(material.getId());
        dto.setTitle(material.getTitle());
        dto.setSubject(material.getSubject());
        dto.setStatus(material.getStatus());
        dto.setFileUrl(material.getFileUrl());
        dto.setType(material.getType());
        dto.setUploadDate(material.getUploadDate());
        return dto;
    }

    @Override
    public List<MaterialResponseDto> getMyDownloads() {
        User user = getCurrentUser();
        return downloadLogRepository.findByUserOrderByDownloadDateDesc(user).stream()
                .map(log -> mapToMaterialResponse(log.getMaterial()))
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponseDto> getMyPosts() {
        User user = getCurrentUser();
        return postRepository.findByUserOrderByCreationDateDesc(user).stream()
                .map(post -> {
                    PostResponseDto dto = new PostResponseDto();
                    dto.setId(post.getId());
                    dto.setTitle(post.getTitle());
                    dto.setContent(post.getContent());
                    dto.setCategory(post.getCategory());
                    dto.setCreationDate(post.getCreationDate());
                    dto.setUserName(user.getName());
                    dto.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentResponseDto> getMyComments() {
        User user = getCurrentUser();
        return commentRepository.findByUserOrderByCreationDateDesc(user).stream()
                .map(comment -> {
                    CommentResponseDto dto = new CommentResponseDto();
                    dto.setId(comment.getId());
                    dto.setContent(comment.getContent());
                    dto.setCreationDate(comment.getCreationDate());
                    dto.setUserName(user.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public String uploadProfilePic(MultipartFile file) {
        // A. Get Current User
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getProfilePicUrl() != null && !user.getProfilePicUrl().isEmpty()) {
            try {
                cloudinaryService.deleteFile(user.getProfilePicUrl());
            } catch (Exception e) {
                // Ignore error if old file not found, continue uploading new one
                System.out.println("Could not delete old profile pic: " + e.getMessage());
            }
        }

        // C. Upload New Image
        String newImageUrl = cloudinaryService.uploadFile(file);

        // D. Save URL to DB
        user.setProfilePicUrl(newImageUrl);
        userRepository.save(user);

        return newImageUrl;
    }
    @Override
    @org.springframework.transaction.annotation.Transactional
    public void toggleSavedMaterial(Long materialId) {
        User user = getCurrentUser();

        com.backend.backend.entity.Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        if (user.getSavedMaterials().contains(material)) {
            user.getSavedMaterials().remove(material);
        } else {
            user.getSavedMaterials().add(material);
        }
        userRepository.save(user);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void toggleSavedPost(Long postId) {
        User user = getCurrentUser();

        com.backend.backend.entity.Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (user.getSavedPosts().contains(post)) {
            user.getSavedPosts().remove(post);
        } else {
            user.getSavedPosts().add(post);
        }

        userRepository.save(user);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<MaterialDto> getSavedMaterials() {
        User user = getCurrentUser();
        return user.getSavedMaterials().stream()
                .map(material -> MaterialDto.builder()
                        .id(material.getId())
                        .title(material.getTitle())
                        .description(material.getDescription())
                        .subject(material.getSubject())
                        .fileUrl(material.getFileUrl())
                        .uploadDate(material.getUploadDate())
                        .uploadedBy(material.getUploadedBy().getName()) // Break Loop
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<PostDto> getSavedPosts() {
        User user = getCurrentUser();
        return user.getSavedPosts().stream()
                .map(post -> PostDto.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .createdAt(post.getCreationDate())
                        .authorName(post.getUser().getName()) // Break Loop
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }
}