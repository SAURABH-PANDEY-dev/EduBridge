package com.backend.backend.controller;

import com.backend.backend.dto.*;
import com.backend.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for User Profile operations.
 * Handles endpoints related to user updates.
 */
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    /**
     * Endpoint to change the logged-in user's password.
     * URL: POST http://localhost:8080/api/users/change-password
     * * @param changePasswordDto The request body containing password details.
     * @return Success message.
     */
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto changePasswordDto) {
        String response = userService.changePassword(changePasswordDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto) {
        String response = userService.forgotPassword(forgotPasswordDto.getEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Endpoint to reset password using the token.
     * URL: POST http://localhost:8080/api/users/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        String response = userService.resetPassword(resetPasswordDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //  Get My Profile
    @GetMapping("/profile")
    public ResponseEntity<UserResponseDto> getMyProfile() {
        return new ResponseEntity<>(userService.getMyProfile(), HttpStatus.OK);
    }

    //Update My Profile (Name/University)
    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto> updateProfile(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.updateMyProfile(userDto), HttpStatus.OK);
    }

    //Get My Uploads (Dashboard)
    @GetMapping("/uploads")
    public ResponseEntity<List<MaterialResponseDto>> getMyUploads() {
        return new ResponseEntity<>(userService.getMyUploads(), HttpStatus.OK);
    }

    // --- My Activity Section ---

    // 4. My Downloads History
    @GetMapping("/activity/downloads")
    public ResponseEntity<List<MaterialResponseDto>> getMyDownloads() {
        return new ResponseEntity<>(userService.getMyDownloads(), HttpStatus.OK);
    }

    // 5. My Posts
    @GetMapping("/activity/posts")
    public ResponseEntity<List<PostResponseDto>> getMyPosts() {
        return new ResponseEntity<>(userService.getMyPosts(), HttpStatus.OK);
    }

    // 6. My Comments
    @GetMapping("/activity/comments")
    public ResponseEntity<List<CommentResponseDto>> getMyComments() {
        return new ResponseEntity<>(userService.getMyComments(), HttpStatus.OK);
    }
    //Upload Profile Picture
    @PostMapping("/profile-pic")
    public ResponseEntity<String> uploadProfilePic(@RequestParam("file") MultipartFile file) {
        String imageUrl = userService.uploadProfilePic(file);
        return ResponseEntity.ok("Profile picture updated successfully! URL: " + imageUrl);
    }

    // ========================================================================
    // BOOKMARKS / SAVED ITEMS ENDPOINTS
    // ========================================================================
    /**
     * Toggles the saved status of a material (notes/pdf).
     * If already saved, it removes it. If not, it adds it.
     * @param materialId The ID of the material to save/unsave.
     * @return Success message.
     */
    @PostMapping("/materials/{materialId}/save")
    public ResponseEntity<String> toggleSavedMaterial(@PathVariable Long materialId) {
        userService.toggleSavedMaterial(materialId);
        return ResponseEntity.ok("Material saved/unsaved successfully.");
    }

    /**
     * Toggles the saved status of a forum post.
     * @param postId The ID of the post to save/unsave.
     * @return Success message.
     */
    @PostMapping("/posts/{postId}/save")
    public ResponseEntity<String> toggleSavedPost(@PathVariable Long postId) {
        userService.toggleSavedPost(postId);
        return ResponseEntity.ok("Post saved/unsaved successfully.");
    }

    /**
     * Retrieves the list of all materials saved/bookmarked by the current user.
     * @return List of Material entities.
     */
    @GetMapping("/saved-materials")
    public ResponseEntity<java.util.List<MaterialDto>> getSavedMaterials() {
        return ResponseEntity.ok(userService.getSavedMaterials());
    }

    /**
     * Retrieves the list of all forum posts saved/bookmarked by the current user.
     * @return List of Post entities.
     */
    @GetMapping("/saved-posts")
    public ResponseEntity<java.util.List<PostDto>> getSavedPosts() {
        return ResponseEntity.ok(userService.getSavedPosts());
    }
}